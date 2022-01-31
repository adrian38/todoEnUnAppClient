import { Component, NgZone, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ImagenmodalPage } from '../imagenmodal/imagenmodal.page';
import {
    AlertController,
    IonContent,
    IonSegment,
    LoadingController,
    ModalController,
    NavController,
    Platform,
} from '@ionic/angular';
import { MessageModel } from 'src/app/models/message.model';
import { TaskModel } from 'src/app/models/task.model';
import { ObtSubSService } from 'src/app/services/obt-sub-s.service';
import { TaskOdooService } from 'src/app/services/task-odoo.service';
import { ChatOdooService } from 'src/app/services/chat-odoo.service';
import { AuthOdooService } from 'src/app/services/auth-odoo.service';
import { PhotoService } from 'src/app/services/photo.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { Observable, Subscription } from 'rxjs';
import { Comments } from 'src/app/interfaces/interfaces';

@Component({
    selector: 'app-task-hired',
    templateUrl: './task-hired.page.html',
    styleUrls: ['./task-hired.page.scss'],
})
export class TaskHiredPage implements OnInit {
    pre: number;
    presupuesto: number;
    //display: boolean = false
    task: TaskModel;
    message: MessageModel;
    messagesList: MessageModel[];
    user: UsuarioModel;

    poHired$: Observable<any>;
    notificationError$: Observable<any>;

    subscriptionpoHired: Subscription;
    subscriptionsNotificationError: Subscription;

    messagesList$: Observable<any>;
    subscriptionMessList: Subscription;

    habilitar_0: boolean = true;
    habilitar_1: boolean = true;
    habilitar_2: boolean = true;

    imagen_0 = '../../../assets/images/noImage.svg ';
    imagen_1 = '../../../assets/images/noImage.svg ';
    imagen_2 = '../../../assets/images/noImage.svg ';

    valor_segment: string = '';
    ultimo_sms: string = '';
    sms_cliente: string = '';
    chat_vacia: boolean = false;
    ruta: string = '';
    fecha: string = '';
    hora: string = '';
    comentario_clasificacion: string = '';
    //comentario_evidencia: string = ''
    displayClasificar: boolean = false;
    clasificacion: number = 0;
    val: number;
    barraChat: boolean = true;
    tempMessageId: number[] = [];

    loading: HTMLIonLoadingElement = null;
    loadingg: HTMLIonLoadingElement = null;

    finish: boolean = false;
    opinion: boolean = false;

    @ViewChild(IonContent) content: IonContent;
    @ViewChild(IonSegment) segment: IonSegment;
    @ViewChild('target') private myScrollContainer: ElementRef;

    constructor(
        private _taskOdoo: TaskOdooService,
        private navCtrl: NavController,
        private datos: ObtSubSService,
        private modalCtrl: ModalController,
        private _chatOdoo: ChatOdooService,
        private _authOdoo: AuthOdooService,
        private ngZone: NgZone,
        public loadingController: LoadingController,
        private alertCtrl: AlertController,
        public photoService: PhotoService,
        private messageService: MessageService,
        // private screenOrientation: ScreenOrientation,
        private router: Router
    ) {
        this.task = this._taskOdoo.getTaskCesar();
        this.user = this._authOdoo.getUser();
        this.message = new MessageModel();
        this.messagesList = [];
    }

    ngAfterViewInit() {
        if (this.ruta == 'tabs/tab2') {
            this.segment.value = 'chat';
            this.barraChat = true;
            this.scrollToElement();
        } else {
            this.segment.value = 'detalle';
            this.barraChat = false;
        }
    }

    ngOnInit() {
        // this.screenOrientation.lock('portrait');
        this.ruta = this.datos.getruta();
        this.presupuesto = this.task.work_force_extra + this.task.materials_extra;
        this._taskOdoo.aplicationListEdit(0, 2, this.task);
        this.subscriptions();

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

    ngOnDestroy() {
        this.subscriptionpoHired.unsubscribe();
        this.subscriptionsNotificationError.unsubscribe();
        this.subscriptionMessList.unsubscribe();

        this._taskOdoo.aplicationListEdit(this.task.So_id, 3, this.task);
    }

    subscriptions() {
        this.notificationError$ = this._taskOdoo.getNotificationError$();
        this.subscriptionsNotificationError = this.notificationError$.subscribe(
            (notificationError) => {
                this.ngZone.run(() => {
                    switch (notificationError.type) {
                        case 0:
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Conectandose al Servidor.',
                            });
                            this.loading.dismiss();
                            break;

                        case 9:
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Cargando fotos de la tarea.',
                            });
                            //this.loading1.dismiss();
                            break;

                        case 11:
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Actualizando la fecha de la tarea.',
                            });
                            //this.loading1.dismiss();
                            break;

                        case 13:
                            if (this.loading) {
                                this.loading.dismiss();
                            }

                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Finalizando la tarea.',
                            });
                            this.displayClasificar = false;
                            break;

                        case 14:
                            if (this.loadingg) {
                                this.loadingg.dismiss();
                            }

                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Guardando su calificacion.',
                            });

                            this.opinion = false;
                            //this.loading1.dismiss();
                            break;
                    }
                });
            }
        );

        this.poHired$ = this._taskOdoo.getRequestedTask$();
        this.subscriptionpoHired = this.poHired$.subscribe((hired) => {
            this.ngZone.run(() => {
                switch (hired.type) {
                    case 8:
                        //!quitar cargando

                        // if (this.task.So_id === hired.So_id) {
                        //   this.task.photoSO = hired.photoSO
                        //   this.task.photoProvider = hired.task.PhotoProvider

                        //   this.task.downloadPhotoSo = true
                        // }

                        this.ver_imagenes();

                        if (this.loadingg) {
                            this.loadingg.dismiss();
                        }

                        this.messageService.add({
                            severity: 'success',
                            detail: 'Fotos cargadas correctamente',
                        });
                        break;

                    case 11:
                        //!!!Cargado Foto

                        // if (this.task.So_id === hired.task.So_id) {
                        //   this.task.downloadPhotoSo = true
                        //   this.task.photoProvider = hired.task.photoProvider
                        //   this.ver_imagenes()
                        // }

                        if (this.loadingg) {
                            this.loadingg.dismiss();
                        }

                        this.messageService.add({
                            severity: 'success',
                            detail: 'No hay Fotos',
                        });

                        break;

                    case 12:
                        //!Quitar cargado

                        this.tempMessageId = [];
                        let temp_Up_Chat = [];
                        let tempTask: TaskModel;

                        for (let mess of hired.task) {
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
                            this._chatOdoo.requestNewMessage(this.tempMessageId);
                        } else {
                            this._taskOdoo.aplicationListEdit(0, 5, tempTask, 0, temp_Up_Chat);
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

                        break;

                    case 17:
                        if (this.loading) {
                            this.loading.dismiss();
                        }

                        this.messageService.add({
                            severity: 'success',
                            detail: 'Finalizacion correcta de la tarea ',
                        });

                        this.displayClasificar = true;

                        break;

                    case 18:
                        if (this.loadingg) {
                            this.loadingg.dismiss();
                        }

                        this.messageService.add({
                            severity: 'success',
                            detail: 'Calificacion enviada correctamente',
                        });

                        this.displayClasificar = false;

                        this.task.budget = this.task.materials + this.task.work_force;
                        this._taskOdoo.aplicationListEdit(this.task.So_id, 7);

                        this.navCtrl.navigateRoot('/tabs/tab2', {
                            animated: true,
                            animationDirection: 'back',
                        });

                        break;
                }
            });
        });

        this.messagesList$ = this._chatOdoo.getMessages$();
        this.subscriptionMessList = this.messagesList$.subscribe((messaggeList) => {
            this.ngZone.run(() => {
                switch (messaggeList.type) {
                    case 0:
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
                        for (let mess of messaggeList.messages)
                            if (mess.offer_id === this.task.Po_id) {
                                if (
                                    typeof this.messagesList !== 'undefined' &&
                                    this.messagesList.length > 0
                                ) {
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

    pushToChat() {
        if (this.message.message.length > 0) {
            this.message.offer_id = this.task.Po_id;
            this._chatOdoo.sendMessageClient(this.message);
            this.ultimo_sms = this.message.message;
            this.message = new MessageModel();
        }
    }

    segChange(event) {
        if (event.detail.value === 'detalle') {
            this.barraChat = false;
            if (!this.task.downloadPhotoSo) {
                //!cargado por las fotos
                this.Loadinggf('Cargando las Fotos');
                //console.log("cargando fotos de tarea contratada", this.task);
                this._taskOdoo.requestPhotoSoHired(this.task);
            } else {
                this.ver_imagenes();
            }
        } else {
            this.barraChat = true;
        }
    }

    selectLastMessage() {
        for (let i = 0; i < this.messagesList.length; i++) {
            if (this.messagesList[i].author_id != this.user.partner_id) {
                this.sms_cliente = this.messagesList[i].message;
            }
        }
    }

    onClickUbicacion() {
        this.datos.setLatitud(parseFloat(this.task.address.latitude));
        this.datos.setLongitud(parseFloat(this.task.address.longitude));
        this.navCtrl.navigateRoot('/maparesumen', {
            animated: true,
            animationDirection: 'forward',
        });
    }

    onClickCostoEntrada() {
        this.navCtrl.navigateRoot('/costo-extra', {
            animated: true,
            animationDirection: 'forward',
        });
    }

    onClickFactura() {
        this._taskOdoo.setTaskChat(this.task);
        this.navCtrl.navigateRoot('/task-bill', {
            animated: true,
            animationDirection: 'forward',
        });
    }

    verFactura() {
        this._taskOdoo.setLastRoute(this.router.url);
        this._taskOdoo.setTaskChat(this.task);

        this.navCtrl.navigateRoot('/task-bill', {
            animated: true,
            animationDirection: 'forward',
        });
    }

    onClickDenunciar(event) {
        this.navCtrl.navigateRoot('/task-complaint', {
            animated: true,
            animationDirection: 'forward',
        });
    }

    onClickFinalizar(event) {
        // this.presentLoading()
        if (!this.task.cash) {
            this.finish = true;
            this.presentLoading();
            this._taskOdoo.payProvider(this.task.Po_id);
        } else {
            this.messageService.add({
                severity: 'success',
                detail: 'Pago en efectivo ',
            });
            //this._taskOdoo.payProviderCash(this.task.Po_id)
        }
    }

    onClose() {
        ////console.log("Close clicked¿¿¿¿¿");
        this.navCtrl.navigateRoot('/tabs/tab2', {
            animated: true,
            animationDirection: 'back',
        });
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

    ver_imagenes() {
        if (typeof this.task.photoSO !== 'undefined' && this.task.photoSO.length == 0) {
            this.imagen_0 = '../../../assets/images/noImage.svg ';
            this.imagen_1 = '../../../assets/images/noImage.svg ';
            this.imagen_2 = '../../../assets/images/noImage.svg ';
            this.habilitar_0 = true;
            this.habilitar_1 = true;
            this.habilitar_2 = true;
        }

        if (this.task.photoSO.length == 1) {
            this.imagen_0 = this.task.photoSO[0];
            this.imagen_1 = '../../../assets/images/noImage.svg ';
            this.imagen_2 = '../../../assets/images/noImage.svg ';
            this.habilitar_0 = false;
            this.habilitar_1 = true;
            this.habilitar_2 = true;
        }
        if (this.task.photoSO.length == 2) {
            this.imagen_0 = this.task.photoSO[0];
            this.imagen_1 = this.task.photoSO[1];
            this.imagen_2 = '../../../assets/images/noImage.svg ';
            this.habilitar_0 = false;
            this.habilitar_1 = false;
            this.habilitar_2 = true;
        }
        if (this.task.photoSO.length == 3) {
            this.imagen_0 = this.task.photoSO[0];
            this.imagen_1 = this.task.photoSO[1];
            this.imagen_2 = this.task.photoSO[2];
            this.habilitar_0 = false;
            this.habilitar_1 = false;
            this.habilitar_2 = false;
        }
    }

    imageClick(imagen) {
        this.modalCtrl
            .create({
                component: ImagenmodalPage,
                componentProps: {
                    imagen: imagen,
                },
            })
            .then((modal) => modal.present());
    }

    async presentLoading() {
        this.loading = await this.loadingController.create({
            cssClass: 'my-custom-class',
            message: 'Espere...',
            //duration: 2000
        });

        return this.loading.present();
    }

    async Loadinggf(sms) {
        this.loadingg = await this.loadingController.create({
            cssClass: 'my-custom-class',
            message: sms,
        });

        return this.loadingg.present();
    }

    async alertaDateChange() {
        const prompt = await this.alertCtrl.create({
            header: 'Fecha y Horario',
            message: 'Menu de cambio',
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
                    text: 'Actualizar',
                    handler: (data) => {
                        if (data.fecha == '' || data.hora == '') {
                            ////console.log('los campos estan vacios .Debo sacar un cartel para avisar');
                            this.alertaSinFecha();
                            // //console.log('c1', this.fecha);
                            // //console.log('c2', this.hora);
                        } else {
                            this.task.date_planned = data.fecha + ' ' + data.hora + ':00';
                            this.task.time = data.fecha + ' ' + data.hora + ':00';

                            this._taskOdoo.updateDateSo(this.task);

                            //!Poner Cargado
                            this.Loadinggf('Actualizando');

                            //this.presentLoading();
                            console.log('nueva fecha', this.task.date_planned);
                            // //console.log('c2', this.hora);
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

    btn_ahoraNo() {
        //console.log('No voy a clasificar ahora');
        this.task.So_budget = this.task.materials + this.task.work_force;
        this._taskOdoo.aplicationListEdit(this.task.So_id, 7);
        this.displayClasificar = false;
        this.navCtrl.navigateRoot('/tabs/tab2', {
            animated: true,
            animationDirection: 'back',
        });
    }

    btn_enviarClasificacion() {
        if (this.clasificacion < 1) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Rellene los campos.',
            });
        } else {
            this.opinion = true;

            this.Loadinggf('Guardando su opinion');

            let comment: Comments = {
                author: '',
                comment: this.comentario_clasificacion,
                ranking: this.clasificacion,
            };

            //console.log(comment,"comentario a enviar")

            this._taskOdoo.setProviderComment(this.task.Po_id, comment);
        }
    }
}
