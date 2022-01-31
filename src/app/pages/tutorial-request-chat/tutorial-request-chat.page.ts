import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
    AlertController,
    IonContent,
    LoadingController,
    MenuController,
    NavController,
    Platform,
} from '@ionic/angular';
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
    selector: 'app-tutorial-request-chat',
    templateUrl: './tutorial-request-chat.page.html',
    styleUrls: ['./tutorial-request-chat.page.scss'],
})
export class TutorialRequestChatPage implements OnInit {
    purchaseOrderID: number;
    fecha: Date;
    reloj: Date;
    displayAdjunto: boolean = false;
    foto: string = '';
    foto64: string = '';
    fo: boolean = false;

    task: TaskModel = new TaskModel();

    message: MessageModel = new MessageModel();
    messagesList: MessageModel[] = [];

    loadingg: HTMLIonLoadingElement = null;

    messagesList$: Observable<any>;
    subscriptionMessList: Subscription;

    messageNotification$: Observable<any>; // servicio comunicacion
    subscriptionsMessageNotification: Subscription;

    notificationError$: Observable<any>;
    subscriptionsNotificationError: Subscription;

    user: UsuarioModel = new UsuarioModel();

    loading: HTMLIonLoadingElement = null;

    fotoTemporal: string = ' ';

    chat_vacia: boolean = true;

    tempMessageId: number[];

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
        this.user.id = 129;
        this.user.partner_id = 217;
        this.user.password = 'anonimo';
        this.user.username = 'anonimo@example.com';
    }

    ngOnInit(): void {
        //this._taskOdoo.setChat(true);
        //this.presentLoading();
        this.subscriptions();

        //console.log(this.messagesList, "esta es la tarea")

        if (typeof this.task.messageList !== 'undefined' && this.task.messageList.length > 0) {
            this.messagesList = this.task.messageList;
            this.selectLastMessage();
            this.chat_vacia = false;
        } else {
            this.chat_vacia = true;
        }

        if (
            typeof this.task.Up_coming_Chat !== 'undefined' &&
            this.task.Up_coming_Chat.length > 0
        ) {
            //!Poner cargado de mensajes

            this.tempMessageId = [];

            for (let mess of this.task.Up_coming_Chat) {
                if (mess.Po_id === this.task.Po_id) {
                    this.tempMessageId.push(mess.messageID);
                }
            }
            if (typeof this.tempMessageId !== 'undefined' && this.tempMessageId.length > 0) {
                this._chatOdoo.requestNewMessage(this.tempMessageId);
                this.chat_vacia = false;
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
            this.navCtrl.navigateRoot('/anonimus-card', {
                animated: true,
                animationDirection: 'back',
            });
        });

        this.messageNotification$ = this._taskOdoo.getRequestedTask$();
        this.subscriptionsMessageNotification = this.messageNotification$.subscribe(
            (notification: any) => {
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

                            if (
                                typeof this.tempMessageId !== 'undefined' &&
                                this.tempMessageId.length > 0
                            ) {
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
                            if (this.loadingg) {
                                this.loadingg.dismiss();
                            }

                            this.messageService.add({
                                severity: 'success',
                                detail: 'Fecha de la solicitud correctamente actualizada ',
                            });
                    }
                });
            }
        );

        this.notificationError$ = this._taskOdoo.getNotificationError$();
        this.subscriptionsNotificationError = this.notificationError$.subscribe(
            (notificationError) => {
                this.ngZone.run(() => {
                    switch (notificationError.type) {
                        case 0:
                            //this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Conectandose al Trabajador.' });
                            break;

                        case 6:
                            //this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Enviando su mensaje.' });

                            break;

                        case 10:
                            //this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Obteniendo nuevo mensaje.' });

                            break;
                    }
                });
            }
        );

        this.messagesList$ = this._chatOdoo.getMessages$();
        this.subscriptionMessList = this.messagesList$.subscribe((messaggeList) => {
            this.ngZone.run(() => {
                switch (messaggeList.type) {
                    case 0:
                        //console.log(messaggeList.messages)
                        if (messaggeList.messages.offer_id === this.task.Po_id) {
                            messaggeList.messages.author = this.user.realname;
                            messaggeList.messages.author_id = this.user.partner_id;

                            if (this.chat_vacia) {
                                this.chat_vacia = false;
                            }

                            this.messagesList.push(messaggeList.messages);

                            this.scrollToElement();
                        }

                        break;

                    case 1:
                        //console.log(messaggeList.messages, "mensaje q llega")

                        for (let mess of messaggeList.messages)
                            if (mess.offer_id === this.task.Po_id) {
                                if (
                                    typeof this.messagesList !== 'undefined' &&
                                    this.messagesList.length > 0
                                ) {
                                    //console.log("uniendo los arreglos");
                                    this.messagesList.push(mess);
                                } else {
                                    this.messagesList.push(mess);
                                    this.chat_vacia = false;
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

    onClose() {
        this.navCtrl.navigateRoot('/ofertas', {
            animated: true,
            animationDirection: 'back',
        });
    }

    async Loadinggf(sms) {
        this.loadingg = await this.loadingController.create({
            cssClass: 'my-custom-class',
            message: sms,
            //duration: 2000
        });

        return this.loadingg.present();
    }
}
