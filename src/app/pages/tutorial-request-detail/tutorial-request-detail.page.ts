import { Component, NgZone, OnInit } from '@angular/core';
import { LoadingController, NavController, Platform } from '@ionic/angular';
import { TaskModel } from 'src/app/models/task.model';
import { ObtSubSService } from 'src/app/services/obt-sub-s.service';
import { TaskOdooService } from 'src/app/services/task-odoo.service';
import { Observable, Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

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

    constructor(
        private _taskOdoo: TaskOdooService,
        private ngZone: NgZone,
        private subServ: ObtSubSService,
        public navCtrl: NavController,
        public loadingController: LoadingController,
        private messageService: MessageService,
        private router: Router,
        private platform: Platform
    ) {
        this.task = this._taskOdoo.getTaskCesar();
    }

    ngOnInit() {
        this.subscriptions();

        if (typeof this.task.So_offers !== 'undefined' && this.task.So_offers.length > 0) {
            let tempPoid = [];
            //this.offersList = this.task.So_offers

            for (let offert of this.task.So_offers) {
                if (!offert.photoProvider) {
                    tempPoid.push(offert.provider_id);
                }
            }

            if (typeof tempPoid !== 'undefined' && tempPoid.length > 0) {
                this.presentLoading();
                this._taskOdoo.getProvidersInfoOfferAnonimus(tempPoid, this.task.So_id);
            }
        }

        // if (
        //   typeof this.task.Up_coming_Offer !== 'undefined' &&
        //   this.task.Up_coming_Offer.length > 0
        // ) {
        //   this.presentLoading();
        //   this._taskOdoo.requestPo(this.task.Up_coming_Offer, this.task.So_id)
        // }
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
                        // if (
                        //   typeof this.offersList !== 'undefined' &&
                        //   this.offersList.length > 0
                        // ) {
                        //   for (let i = 0; i < offers.task.length; i++) {
                        //     if (this.task.So_origin === offers.task[i]['origin']) {
                        //       let temp = this.offersList.findIndex(
                        //         (element) => element.Po_id === offers.task[i]['order_id'],
                        //       )

                        //       if (temp != -1) {
                        //         this.offersList.splice(temp, 1)

                        //       }
                        //     }
                        //   }

                        //}
                        // if(this.offersList.length === 0){
                        //   this.showSubCard = false
                        //   this.ofertaDisponible = true
                        // }

                        if (this.loading) {
                            this.loading.dismiss();
                        }

                        break;

                    case 5:
                        //console.log(this.task,"task actualizado")
                        // for (let offer of this.offersList) {
                        //   for (let tempInfo of offers.task) {
                        //     if (tempInfo.provider_id === offer.provider_id) {

                        //       offer.photoProvider = tempInfo.photoProvider
                        //       offer.provider_name = tempInfo.provider_name
                        //       offer.opinions_provider = tempInfo.opinions_provider
                        //       offer.ranking_provider = tempInfo.ranking_provider
                        //     }
                        //   }
                        // }

                        if (this.loading) {
                            this.loading.dismiss();
                        }
                        // this.showSubCard = true
                        // this.ofertaDisponible = false

                        break;

                    case 6:
                        // this.loading1.dismiss()
                        // this._taskOdoo.aplicationListEdit(this.tempPaid.So_id,6,this.tempPaid)
                        // this.messageService.add({
                        //   severity: 'success',
                        //   detail: 'Pago ingresado correctamente',
                        // })

                        // setTimeout(() => {
                        //   this.navCtrl.navigateRoot('/tabs/tab1', {
                        //     animated: true,
                        //     animationDirection: 'back',
                        //   })
                        // }, 2000)

                        break;

                    case 8:
                        // this.disableImages()

                        // if (this.loading1) {
                        //   this.loading1.dismiss()
                        // }

                        // this.messageService.add({
                        //   severity: 'success',
                        //   detail: 'Fotos cargadas correctamente',
                        // })

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
                        // if (!(typeof this.offersList !== 'undefined' && this.offersList.length > 0)) {
                        // //   this.offersList = [].concat(offers.task, this.offersList)

                        // // } else {

                        //   this.offersList = this.task.So_offers;
                        //   console.log(this.offersList, "ofertas q tienes")
                        //   this.showSubCard = true
                        //   this.ofertaDisponible = false
                        // }

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

                        // if (this.loading1) {
                        //   this.loading1.dismiss()
                        // }

                        break;

                    // case 13:
                    //   if (
                    //     typeof this.offersList !== 'undefined' &&
                    //     this.offersList.length > 0
                    //   ) {
                    //     for (let i = 0; i < offers.task.length; i++) {
                    //       if (this.task.So_origin === offers.task[i].origin) {
                    //         let temp = this.offersList.findIndex(
                    //           (element) => element.Po_id === offers.task[i].order_id,
                    //         )

                    //         if (temp != -1) {
                    //           switch (offers.task[i].product_id) {
                    //             // case 39:

                    //             // 	task.type = "Servicio de Fontanería"
                    //             // 	break;

                    //             case 40:
                    //               this.offersList[temp].work_force +=
                    //                 offers.task[i].price_unit
                    //               break

                    //             case 41:
                    //               this.offersList[temp].materials +=
                    //                 offers.task[i].price_unit
                    //               break
                    //           }
                    //         }
                    //       }
                    //     }
                    //   }
                    //   break

                    case 19:
                        this.offsetComment += 2;

                        //     if(offers.task != false){

                        //       console.log("mas comentarios", offers.task)

                        //     this.offsetComment += 2;

                        //     // for (let offer of this.offersList) {
                        //     //   for (let tempInfo of offers.task) {

                        //     //     if (tempInfo.provider_id === offer.provider_id) {

                        //     //       offer.opinions_provider =  tempInfo.opinions_provider
                        //     //       this.tempInfoProvider.opinions_provider =  tempInfo.opinions_provider

                        //     //     }
                        //     //   }
                        //     // }
                        //   }

                        //     //console.log("comentarios",this.tempInfoProvider.opinions_provider)

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
        //console.log("oferta selec", offer);
        // offer.Up_coming_Chat = this.task.Up_coming_Chat
        // this.displayAceptar = -1

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
}
