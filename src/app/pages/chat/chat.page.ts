import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonContent, LoadingController, MenuController, NavController, Platform } from '@ionic/angular';
import { MessageService } from 'primeng/api';
//import { timeStamp } from 'console';
import { Observable, Subscription } from 'rxjs';
import { MessageModel } from 'src/app/models/message.model';
import { TaskModel } from 'src/app/models/task.model';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthOdooService } from 'src/app/services/auth-odoo.service';
import { ChatOdooService } from 'src/app/services/chat-odoo.service';
//import { ObtSubSService } from 'src/app/services/obt-sub-s.service';
import { PhotoService } from 'src/app/services/photo.service';
import { TaskOdooService } from 'src/app/services/task-odoo.service';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.page.html',
    styleUrls: ['./chat.page.scss'],
    providers: [MessageService],
})
export class ChatPage implements OnInit {
    /* @ViewChild("content") content:any; */

    purchaseOrderID: number;
    fecha: Date;
    reloj: Date;
    displayAdjunto: boolean = false;
    foto: string = '';
    foto64: string = '';
    fo: boolean = false;

    task: TaskModel = new TaskModel();

    message: MessageModel;
    messagesList: MessageModel[] = [];

    messagesList$: Observable<any>;
    subscriptionMessList: Subscription;

    messageNotification$: Observable<any>; // servicio comunicacion
    subscriptionsMessageNotification: Subscription;

    notificationError$: Observable<any>;
    subscriptionsNotificationError: Subscription;

    user: UsuarioModel;

    loading: HTMLIonLoadingElement = null;

    fotoTemporal: string = ' ';

    tempMessageId: number[] = [];
    btn_unable: boolean = false;

    @ViewChild(IonContent) content: IonContent;
    @ViewChild('target') private myScrollContainer: ElementRef;

    ultimo_sms: string = '';
    sms_cliente: string = '';
    constructor(
        private _authOdoo: AuthOdooService,
        private _taskOdoo: TaskOdooService,
        private _chatOdoo: ChatOdooService,
        public navCtrl: NavController,
        //private datos: ObtSubSService,
        private menu: MenuController,
        private ngZone: NgZone,
        private platform: Platform,
        public photoService: PhotoService,
        private alertCtrl: AlertController,
        public loadingController: LoadingController,
        private router: Router,
        private messageService: MessageService
    ) {
        this.task = this._taskOdoo.getTaskChat();
        this.user = this._authOdoo.getUser();
        this.message = new MessageModel();
        this.messagesList = [];
    }

    ngOnInit(): void {
        this.subscriptions();

        if (typeof this.task.messageList !== 'undefined' && this.task.messageList.length > 0) {
            this.messagesList = this.task.messageList;
            this.selectLastMessage();
        }

        if (typeof this.task.Up_coming_Chat !== 'undefined' && this.task.Up_coming_Chat.length > 0) {
            //!Poner cargado de mensajes

            this.tempMessageId = [];

            for (let mess of this.task.Up_coming_Chat) {
                if (mess.Po_id === this.task.Po_id) {
                    this.tempMessageId.push(mess.messageID);
                }
            }
            if (typeof this.tempMessageId !== 'undefined' && this.tempMessageId.length > 0) {
                this._chatOdoo.requestNewMessage(this.tempMessageId);
            }
        }
    }

    ngAfterViewInit() {
        this.scrollToElement();
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.

        this.subscriptionsNotificationError.unsubscribe();
        this.subscriptionMessList.unsubscribe();
        this.subscriptionsMessageNotification.unsubscribe();

        this._taskOdoo.aplicationListEdit(this.task.So_id, 3, this.task);
    }

    subscriptions() {
        this.platform.backButton.subscribeWithPriority(10, () => {
            this.navCtrl.navigateRoot('/task-offer', {
                animated: true,
                animationDirection: 'back',
            });
        });

        this.messageNotification$ = this._taskOdoo.getRequestedTask$();
        this.subscriptionsMessageNotification = this.messageNotification$.subscribe((notification: any) => {
            this.ngZone.run(() => {
                switch (notification.type) {
                    case 12:
                        //!Quitar cargado

                        this.tempMessageId = [];
                        let temp_Up_Chat = [];
                        let tempTask: TaskModel;

                        //console.log(notification, ' recibiendo nuevo mensaje');

                        for (let mess of notification.task) {
                            if (mess.PO_id === this.task.Po_id) {
                                this.tempMessageId.push(mess.message);
                            } else {
                                temp_Up_Chat.push({
                                    PO_id: mess.PO_id,
                                    messageId: mess.message,
                                    SO_id: mess.SO_id,
                                });
                            }
                        }

                        if (typeof this.tempMessageId !== 'undefined' && this.tempMessageId.length > 0) {
                            //console.log(tempPoId, "id de po a buscar")
                            //console.log(this.tempMessageId, ' mandando mensaje');
                            this._chatOdoo.requestNewMessage(this.tempMessageId);
                        } else {
                            this._taskOdoo.aplicationListEdit(0, 5, tempTask, 0, temp_Up_Chat);
                        }

                        break;

                    case 13:
                        for (let i = 0; i < notification.task.length; i++) {
                            if (this.task.Po_id === notification.task[i].order_id) {
                                switch (notification.task[i].product_id) {
                                    // case 39:

                                    // 	task.type = "Servicio de Fontanería"
                                    // 	break;

                                    case 40:
                                        this.task.work_force += notification.task[i].price_unit;
                                        break;

                                    case 41:
                                        this.task.materials += notification.task[i].price_unit;
                                        break;
                                }
                            }
                        }

                        break;

                    case 15:
                        //!!!quitar cargado actualizar fecha
                        if (this.loading) {
                            this.loading.dismiss();
                        }

                        this.messageService.add({
                            severity: 'success',
                            detail: 'Fecha de la solicitud correctamente actualizada ',
                        });

                        setTimeout(() => {
                            this.navCtrl.navigateRoot('/task-confirm', {
                                animated: true,
                                animationDirection: 'forward',
                            });
                        }, 2000);
                }
            });
        });

        this.notificationError$ = this._taskOdoo.getNotificationError$();
        this.subscriptionsNotificationError = this.notificationError$.subscribe((notificationError) => {
            this.ngZone.run(() => {
                switch (notificationError.type) {
                    case 0:
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Conectandose al Servidor.',
                        });
                        break;

                    case 6:
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Enviando su mensaje.',
                        });

                        break;

                    case 10:
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Obteniendo nuevo mensaje.',
                        });

                        break;
                    case 11:
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Guardando el dia la cita.',
                        });

                        this.btn_unable = false;

                        break;
                }
            });
        });

        this.messagesList$ = this._chatOdoo.getMessages$();
        this.subscriptionMessList = this.messagesList$.subscribe((messaggeList) => {
            this.ngZone.run(() => {
                switch (messaggeList.type) {
                    case 0:
                        //console.log(messaggeList.messages)
                        if (messaggeList.messages.offer_id === this.task.Po_id) {
                            messaggeList.messages.author = this.user.realname;
                            messaggeList.messages.author_id = this.user.partner_id;

                            this.messagesList.push(messaggeList.messages);

                            this.scrollToElement();
                        }

                        break;

                    case 1:
                        //console.log(messaggeList.messages, "mensaje q llega")

                        for (let mess of messaggeList.messages)
                            if (mess.offer_id === this.task.Po_id) {
                                if (typeof this.messagesList !== 'undefined' && this.messagesList.length > 0) {
                                    //console.log("uniendo los arreglos");
                                    this.messagesList.push(mess);
                                } else {
                                    this.messagesList.push(mess);
                                }
                                this.selectLastMessage();
                                this.scrollToElement();
                            }

                        break;
                }
            });
        });
    }

    async presentLoading() {
        this.loading = await this.loadingController.create({
            cssClass: 'my-custom-class',
            message: 'Espere...',
            //duration: 2000
        });

        return this.loading.present();
    }

    pushToChat() {
        if (this.message.message.length > 0) {
            this.message.offer_id = this.task.Po_id;
            this._chatOdoo.sendMessageClient(this.message);
            this.ultimo_sms = this.message.message;
            this.message = new MessageModel();
        }
    }

    scrollToElement(): void {
        if (this.myScrollContainer) {
            setTimeout(() => {
                this.myScrollContainer.nativeElement.scroll({
                    top: this.myScrollContainer.nativeElement.scrollHeight,
                    left: 0,
                    behavior: 'smooth',
                });
            }, 400);
        }
    }

    selectLastMessage() {
        for (let i = 0; i < this.messagesList.length; i++) {
            if (this.messagesList[i].author_id != this.user.partner_id) {
                this.sms_cliente = this.messagesList[i].message;
            }
        }
    }

    async alertaDateChange() {
        const prompt = await this.alertCtrl.create({
            header: 'Fecha y Horario',
            message: 'Introduzca el día de la cita',
            inputs: [
                {
                    name: 'fecha',
                    type: 'date',
                    placeholder: 'Fecha',
                    label: 'fecha',
                },

                {
                    name: 'hora',
                    type: 'time',
                    placeholder: 'Hora',
                    label: 'time',
                },
            ],

            buttons: [
                {
                    text: 'Cancelar',
                    handler: (data) => {
                        //console.log('Cancel clicked');
                    },
                },
                {
                    text: 'Aceptar',
                    handler: (data) => {
                        if (data.fecha == '' || data.hora == '') {
                            this.alertaSinFecha();
                        } else {
                            this.showLoading('Guardando la fecha acordada');
                            this.btn_unable = true;
                            this.task.date_planned = data.fecha + ' ' + data.hora + ':00';
                            this.task.time = data.fecha + ' ' + data.hora + ':00';
                            this._taskOdoo.updateDateSo(this.task);
                        }
                    },
                },
            ],
        });
        prompt.present();
    }

    async alertaSinFecha() {
        const prompt = await this.alertCtrl.create({
            header: 'No se ha actualizado la fecha y la hora',
            message: 'Debe llenar los campos',
            buttons: [
                {
                    text: 'Cancelar',
                    handler: (data) => {
                        //console.log('Cancel clicked');
                    },
                },
            ],
        });
        prompt.present();
    }

    async showLoading(sms) {
        this.loading = await this.loadingController.create({
            cssClass: 'my-custom-class',
            message: sms,
            //duration: 2000
        });

        return this.loading.present();
    }
}
