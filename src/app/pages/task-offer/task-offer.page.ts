import { Component, OnInit, NgZone, ViewChild, OnDestroy } from '@angular/core';

import {
    NavController,
    Platform,
    IonSegment,
    LoadingController,
    ModalController,
    AlertController,
} from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { TaskModel } from 'src/app/models/task.model';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthOdooService } from 'src/app/services/auth-odoo.service';
import { TaskOdooService } from 'src/app/services/task-odoo.service';
import { MessageService } from 'primeng/api';
import { ObtSubSService } from 'src/app/services/obt-sub-s.service';
import { ImagenmodalPage } from '../imagenmodal/imagenmodal.page';
//import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

@Component({
    selector: 'app-task-offer',
    templateUrl: './task-offer.page.html',
    styleUrls: ['./task-offer.page.scss'],
    providers: [MessageService],
})
export class TaskOfferPage implements OnInit {
    @ViewChild(IonSegment) segment: IonSegment;

    val: number;
    userType: string = '';
    user: UsuarioModel;
    task: TaskModel = new TaskModel();

    tempLoadingComment;
    offsetComment: number = 2;

    offersList: TaskModel[] = [];
    habilitar_0: boolean = true;
    habilitar_1: boolean = true;
    habilitar_2: boolean = true;

    offersList$: Observable<any>;
    notificationError$: Observable<any>;

    subscriptionOffersList: Subscription;
    subscriptionsNotificationError: Subscription;

    veroferta: boolean = true;
    verdetalles: boolean = false;
    valorSegment: string = '';

    datos: string = '';
    display: boolean = false;

    fotoZoom: boolean = false;
    loading: HTMLIonLoadingElement = null;
    loading1: any;

    imagenes: string[] = [];

    tempPaid: any;

    tempInfoProvider: TaskModel = new TaskModel();

    constructor(
        public navCtrl: NavController,
        public alertController: AlertController,
        private _taskOdoo: TaskOdooService,
        private _authOdoo: AuthOdooService,
        private ngZone: NgZone,
        private platform: Platform,
        private messageService: MessageService,
        public loadingController: LoadingController,
        //private screenOrientation: ScreenOrientation,
        private subServ: ObtSubSService,
        private modalCtrl: ModalController
    ) {
        this.user = this._authOdoo.getUser();
        this.task = this._taskOdoo.getTaskCesar();

        // console.log(this.task);
    }

    ngAfterViewInit() {
        if (!this.subServ.get_Detalles()) {
            this.segment.value = 'ofertas';
        } else {
            this.segment.value = 'detalle';
        }
    }

    ngOnInit() {
        //this.screenOrientation.lock('portrait');

        if (typeof this.task.So_offers !== 'undefined' && this.task.So_offers.length > 0) {
            let tempPoid = [];
            this.offersList = this.task.So_offers;

            for (let offert of this.task.So_offers) {
                if (!offert.photoProvider) {
                    tempPoid.push(offert.provider_id);
                }
            }

            if (typeof tempPoid !== 'undefined' && tempPoid.length > 0) {
                this.presentLoading();
                this._taskOdoo.getProvidersInfoOffer(tempPoid, this.task.So_id);
            } else {
                this.offersList = this.task.So_offers;
            }
        } else {
            this.messageService.add({
                key: 'c',
                severity: 'error',
                summary: 'Disculpe',
                detail: 'Todavia no hay ofertas.',
            });
        }

        if (
            typeof this.task.Up_coming_Offer !== 'undefined' &&
            this.task.Up_coming_Offer.length > 0
        ) {
            this.presentLoading();
            this._taskOdoo.requestPo(this.task.Up_coming_Offer, this.task.So_id);
        }

        this._taskOdoo.aplicationListEdit(0, 2, this.task);

        this.subscriptions();
    }

    ngOnDestroy(): void {
        this.subscriptionOffersList.unsubscribe();
        this.subscriptionsNotificationError.unsubscribe();
    }

    subscriptions() {
        this.platform.backButton.subscribeWithPriority(10, () => {
            this.navCtrl.navigateRoot('/tabs/tab1', {
                animated: true,
                animationDirection: 'back',
            });
        });

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

                        case 4:
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Error eliminando la oferta.',
                            });
                            this.loading.dismiss();
                            break;

                        case 5:
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Obteniendo Informacion del Trabajador.',
                            });

                            this.loading.dismiss();
                            break;

                        case 6:
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Ingresando Dinero a la Plataforma.',
                            });

                            this.loading1.dismiss();
                            break;
                        case 9:
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Cargando fotos de la tarea.',
                            });
                            this.loading1.dismiss();
                            break;
                        case 15:
                            if (this.tempLoadingComment) {
                                this.tempLoadingComment.target.complete();
                            }

                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Cargando mas comentarios.',
                            });

                            break;
                    }
                });
            }
        );

        this.offersList$ = this._taskOdoo.getRequestedTask$();
        this.subscriptionOffersList = this.offersList$.subscribe((offers) => {
            this.ngZone.run(() => {
                //console.log(offers, 'info recibida');

                switch (offers.type) {
                    case 4:
                        if (this.loading) {
                            this.loading.dismiss();
                        }

                        break;

                    case 5:
                        if (this.loading) {
                            this.loading.dismiss();
                        }

                        break;

                    case 8:
                        this.disableImages();

                        if (this.loading1) {
                            this.loading1.dismiss();
                        }

                        this.messageService.add({
                            severity: 'success',
                            detail: 'Fotos cargadas correctamente',
                        });

                        break;

                    case 9:
                        let tempPoId: number[] = [];
                        let temp_Up_Offer = [];
                        let tempTask: TaskModel;

                        for (let i = 0; i < offers.task.length; i++) {
                            if (this.task.So_origin === offers.task[i]['origin']) {
                                tempPoId.push(offers.task[i]['order_id']);
                            } else {
                                temp_Up_Offer.push({
                                    origin: offers.task[i]['origin'],
                                    PO_id: offers.task[i]['order_id'],
                                });
                            }
                        }

                        if (typeof tempPoId !== 'undefined' && tempPoId.length > 0) {
                            this._taskOdoo.requestPo(tempPoId, this.task.So_id);
                        } else {
                            this._taskOdoo.aplicationListEdit(0, 4, tempTask, temp_Up_Offer);
                        }

                        break;

                    case 10:
                        if (
                            !(typeof this.offersList !== 'undefined' && this.offersList.length > 0)
                        ) {
                            this.offersList = this.task.So_offers;
                            console.log(this.offersList, 'ofertas q tienes');
                        }

                        if (this.loading) {
                            this.loading.dismiss();
                        }

                        this.messageService.add({
                            severity: 'success',
                            detail: 'Nueva Oferta',
                        });

                        break;

                    case 11:
                        //this.task.downloadPhotoSo = true

                        if (this.loading1) {
                            this.loading1.dismiss();
                        }

                        break;

                    case 19:
                        this.offsetComment += 2;

                        if (this.tempLoadingComment) {
                            this.tempLoadingComment.target.complete();
                        }

                        break;
                }
            });
        });
    }

    segChange(event) {
        this.valorSegment = event.detail.value;

        if (this.valorSegment === 'ofertas') {
            this.veroferta = true;
            this.verdetalles = false;
        }

        if (this.valorSegment === 'detalle') {
            this.veroferta = false;
            this.verdetalles = true;

            if (!this.task.downloadPhotoSo) {
                this.temporal('Cargando Fotos...');
                this._taskOdoo.requestPhotoSo(this.task);
            } else {
                this.disableImages();
            }
        }
    }

    openChat(offer: TaskModel) {
        offer.Up_coming_Chat = this.task.Up_coming_Chat;
        this._taskOdoo.setTaskChat(offer);
        this.navCtrl.navigateRoot(['/chat'], {
            animated: true,
            animationDirection: 'back',
        });
    }

    onClickLocation() {
        this.subServ.setruta('/task-offer');
        this.navCtrl.navigateRoot('/map-detail', {
            animated: true,
            animationDirection: 'back',
        });
    }

    showDialog(index) {
        this.offsetComment = this.offersList[index].opinions_provider.length;
        this.tempInfoProvider = this.offersList[index];

        this.display = true;
    }

    cancelPOclient(Po: TaskModel) {
        this.presentLoading();
        this._taskOdoo.cancelPOsuplier(Po);
    }

    async presentLoading() {
        this.loading = await this.loadingController.create({
            cssClass: 'my-custom-class',
            message: 'Espere...',
            //duration: 2000
        });

        return this.loading.present();
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

    editnombre(name) {
        let nombre = name.split(' ');
        if (nombre.length < 2) {
            return nombre[0];
        } else {
            return nombre[0] + ' ' + nombre[1].slice(0, 1) + '.';
        }
    }

    async temporal(message: string) {
        this.loading1 = await this.loadingController.create({
            cssClass: 'my-custom-class',
            message,
        });

        return this.loading1.present();
    }

    disableImages() {
        if (this.task.photoSO.length == 1) {
            this.habilitar_0 = false;
            this.habilitar_1 = true;
            this.habilitar_2 = true;
        }
        if (this.task.photoSO.length == 2) {
            this.habilitar_0 = false;
            this.habilitar_1 = false;
            this.habilitar_2 = true;
        }
        if (this.task.photoSO.length == 3) {
            this.habilitar_0 = false;
            this.habilitar_1 = false;
            this.habilitar_2 = false;
        }
    }

    loadData(event) {
        this.tempLoadingComment = event;
        this._taskOdoo.requestMoreInfoProvider(
            this.tempInfoProvider.So_id,
            this.tempInfoProvider.provider_id,
            this.offsetComment
        );
    }
}
