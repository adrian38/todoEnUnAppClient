import { Component, NgZone, OnInit } from '@angular/core';
import { LoadingController, ModalController, NavController, Platform } from '@ionic/angular';
import { TaskModel } from 'src/app/models/task.model';
import { ObtSubSService } from 'src/app/services/obt-sub-s.service';
import { TaskOdooService } from 'src/app/services/task-odoo.service';
import { Observable, Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ImagenmodalPage } from '../imagenmodal/imagenmodal.page';

@Component({
    selector: 'app-tutorial-request-detail',
    templateUrl: './tutorial-request-detail.page.html',
    styleUrls: ['./tutorial-request-detail.page.scss'],
})
export class TutorialRequestDetailPage implements OnInit {
    task: TaskModel;
    loading: HTMLIonLoadingElement = null;

    offersList$: Observable<any>;
    notificationError$: Observable<any>;

    subscriptionOffersList: Subscription;
    subscriptionsNotificationError: Subscription;

    tempLoadingComment: any = null;

    offsetComment: number = 2;

    tempInfoProvider: TaskModel = new TaskModel();
    display: boolean = false;

    habilitar_0: boolean = true;
    habilitar_1: boolean = true;
    habilitar_2: boolean = true;

    loading1: any;

    constructor(
        private _taskOdoo: TaskOdooService,
        private ngZone: NgZone,
        private subServ: ObtSubSService,
        public navCtrl: NavController,
        public loadingController: LoadingController,
        private messageService: MessageService,
        private router: Router,
        private platform: Platform,
        private modalCtrl: ModalController
    ) {
        this.task = this._taskOdoo.getTaskCesar();
    }

    ngOnInit() {
        this.subscriptions();

        if (!this.task.downloadPhotoSo) {
            this.temporal('Cargando Fotos...');
            this._taskOdoo.requestPhotoSo(this.task);
        } else {
            this.disableImages();
        }

        if (typeof this.task.So_offers !== 'undefined' && this.task.So_offers.length > 0) {
            let tempPoid = [];
            //this.offersList = this.task.So_offers

            for (let offert of this.task.So_offers) {
                if (!offert.photoProvider) {
                    tempPoid.push(offert.provider_id);
                }
            }

            if (typeof tempPoid !== 'undefined' && tempPoid.length > 0) {
                if (this.task.downloadPhotoSo) {
                    this.presentLoading();
                }
                this._taskOdoo.getProvidersInfoOfferAnonimus(tempPoid, this.task.So_id);
            }
        }

        if (
            typeof this.task.Up_coming_Offer !== 'undefined' &&
            this.task.Up_coming_Offer.length > 0
        ) {
            if (this.task.downloadPhotoSo) {
                this.presentLoading();
            }
            this._taskOdoo.requestPo(this.task.Up_coming_Offer, this.task.So_id);
        }
    }

    ngOnDestroy() {
        this.subscriptionOffersList.unsubscribe();
        this.subscriptionsNotificationError.unsubscribe();
        this.task.Up_coming_Offer = [];
    }

    subscriptions() {
        this.platform.backButton.subscribeWithPriority(10, () => {
            this.navCtrl.navigateRoot('/tutorial-requests', {
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
                            //this.btn_deshabilitar = false
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
                            // this.showSubCard = true
                            // this.ofertaDisponible = false
                            this.loading.dismiss();
                            break;

                        case 6:
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Ingresando Dinero a la Plataforma.',
                            });
                            // this.btn_deshabilitar = false;
                            // this.loading1.dismiss()
                            break;
                        case 9:
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Cargando fotos de la tarea.',
                            });
                            // this.loading1.dismiss()
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
                //console.log(offers, 'info recibida')

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
                        if (this.loading) {
                            this.loading.dismiss();
                        }

                        this.messageService.add({
                            severity: 'success',
                            detail: 'Nueva Oferta',
                        });

                        break;

                    case 11:
                        this.task.downloadPhotoSo = true;

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

    async presentLoading() {
        this.loading = await this.loadingController.create({
            cssClass: 'my-custom-class',
            message: 'Espere...',
            //duration: 2000
        });

        return this.loading.present();
    }

    onClickLocation() {
        this.subServ.setruta(this.router.url);
        this.navCtrl.navigateRoot('/map-detail', {
            animated: true,
            animationDirection: 'back',
        });
    }

    openChat(offer: TaskModel) {
        console.log('oferta selec', offer);
        offer.Up_coming_Chat = this.task.Up_coming_Chat;
        this._taskOdoo.setTaskChat(offer);
        this.navCtrl.navigateRoot(['/tutorial-request-chat'], {
            animated: true,
            animationDirection: 'back',
        });
    }

    showDialog(event) {
        this.tempInfoProvider = this.task.So_offers[event];
        this.display = true;
    }

    loadData(event) {
        this.tempLoadingComment = event;
        this._taskOdoo.requestMoreInfoProvider(
            this.tempInfoProvider.So_id,
            this.tempInfoProvider.provider_id,
            this.offsetComment
        );

        //setTimeout(function(){ event.target.complete(); }, 2000);
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
}
