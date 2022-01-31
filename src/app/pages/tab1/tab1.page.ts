import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { AlertController, NavController, LoadingController, Platform } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { TaskModel } from 'src/app/models/task.model';
import { ObtSubSService } from 'src/app/services/obt-sub-s.service';
import { TaskOdooService } from 'src/app/services/task-odoo.service';
import { MessageService } from 'primeng/api';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss'],
    providers: [MessageService],
})
export class Tab1Page implements OnInit {
    btn_animacion: boolean = false;
    cant;
    id_string: string;
    task: TaskModel;
    solicitudesList: TaskModel[] = [];
    messaggeList: number[];
    tab: String;
    loading: any;
    solicitudVacia: boolean = true;

    tasksList$: Observable<any>; // servicio comunicacion
    notificationError$: Observable<any>;

    subscriptiontasksList: Subscription;
    subscriptionsNotificationError: Subscription;

    tempLoadingSolicitud;

    //@ViewChild('tabs') tabs: IonTabs;
    @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

    constructor(
        private subServ: ObtSubSService,
        private _taskOdoo: TaskOdooService,
        private ngZone: NgZone,
        public navCtrl: NavController,
        private platform: Platform,
        public alertCtrl: AlertController,
        private messageService: MessageService,
        public loadingController: LoadingController
    ) {}

    ngOnInit(): void {
        this.subscriptions();
        this.init();
        this.subServ.set_Detalles(false);
        //this._taskOdoo.setTab1In(true);
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.

        this.subscriptiontasksList.unsubscribe();
        this.subscriptionsNotificationError.unsubscribe();
    }

    init() {
        if (!this._taskOdoo.getInitTab()) {
            this._taskOdoo.setInitTab(true);
            this._taskOdoo.requestTaskListClient();
            this.presentLoadingCargado();
        } else {
            this.solicitudesList = this._taskOdoo.getApplicationList();
            console.log(this.solicitudesList, 'solicitudes');
        }
    }

    subscriptions() {
        this.platform.backButton.subscribeWithPriority(10, () => {
            this.loading.dismiss();
            this.presentAlert();
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

                        case 1:
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Error cargando sus Solicitudes.',
                            });
                            this.loading.dismiss();
                            break;

                        case 2:
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Error cargando más Solicitudes.',
                            });
                            this.loading.dismiss();
                            break;
                        case 3:
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Error eliminando la Solicitud.',
                            });
                            this.loading.dismiss();
                            break;

                        // case 5:

                        // 	this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Obteniendo Informacion del Trabajador.' });
                        // 	this.loading.dismiss();
                        // 	break;
                    }
                });
            }
        );

        this.tasksList$ = this._taskOdoo.getRequestedTask$();
        this.subscriptiontasksList = this.tasksList$.subscribe((tasksList: any) => {
            this.ngZone.run(() => {
                //console.log(tasksList, "mas solicitudes llegando");

                switch (tasksList.type) {
                    case 0:
                        //!no hay solicitudes
                        if (this.tempLoadingSolicitud) {
                            this.tempLoadingSolicitud.target.complete();
                        }
                        if (this.loading) {
                            this.loading.dismiss();
                        }

                        break;
                    case 1:
                        this.solicitudesList = this._taskOdoo.getApplicationList();
                        console.log(this.solicitudesList, 'primer cargado tab1');
                        if (this.loading) {
                            this.loading.dismiss();
                        }

                        break;

                    case 2:
                        this.solicitudesList = this._taskOdoo.getApplicationList();

                        if (this.tempLoadingSolicitud) {
                            this.tempLoadingSolicitud.target.complete();
                        }
                        break;

                    case 3:
                        // if (typeof this.solicitudesList !== 'undefined' && this.solicitudesList.length > 0) {

                        // 	let temp = this.solicitudesList.findIndex((element) => element.So_id === tasksList.task);
                        // 	if (temp != -1) {
                        // 		this.solicitudesList.splice(temp, 1);;
                        // 	}
                        // }
                        //!se ha eliminado correctamente y si no hay mas poner vacio

                        break;

                    case 9:
                        // if (typeof this.solicitudesList !== 'undefined' && this.solicitudesList.length > 0) {

                        // 	for (let i = 0; i < tasksList.task.length; i++) {

                        // 		let temp = this.solicitudesList.findIndex((element) => element.So_origin === tasksList.task[i]['origin']);

                        // 		if (temp != -1) {

                        // 			this.solicitudesList[temp].notificationNewOffert = true;
                        // 			//console.log(this.solicitudesList);
                        // 		}

                        // 	}
                        // }

                        this.messageService.add({
                            severity: 'success',
                            detail: 'Ha recibido una nueva oferta',
                        });

                        break;

                    case 12:
                        //console.log(' recibiendo nuevo mensaje TAB1');

                        // if (typeof this.solicitudesList !== 'undefined' && this.solicitudesList.length > 0) {
                        // 	for (let mess of tasksList.task) {

                        // 		let temp = this.solicitudesList.findIndex((element) => element.So_id === mess.SO_id);

                        // 		if (temp != -1) {

                        // 			this.solicitudesList[temp].notificationNewChat = true;
                        // 			//console.log(this.solicitudesList);
                        // 		}
                        // 	}
                        // }

                        break;
                }
                // if (tasksList) {
                // 	this.solicitudesList = this._taskOdoo.getSolicitudeList();
                // }
                // console.log(this.solicitudesList,"tab1")

                if (this.loading) {
                    this.loading.dismiss();
                }
            });
        });
    }

    in(i) {
        this.cant = i;

        this.task = this.solicitudesList[this.cant];
        this._taskOdoo.setTaskCesar(this.task);

        this.navCtrl.navigateRoot('/task-offer', { animated: true, animationDirection: 'forward' });
    }

    irSolicitud() {
        this.navCtrl.navigateRoot('/task-new', { animated: true, animationDirection: 'forward' });
    }

    async presentAlert() {
        if (this.loading) {
            this.loading.dismiss();
        }

        const alert = await this.alertCtrl.create({
            cssClass: 'my-custom-class',
            header: 'Alerta',
            message: 'Desea registrarse con otro usuario',

            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {},
                },
                {
                    text: 'Aceptar',
                    handler: (datos) => {
                        this.navCtrl.navigateRoot('/login', {
                            animated: true,
                            animationDirection: 'back',
                        });
                    },
                },
            ],
        });

        await alert.present();
    }
    cancelar(i: number) {
        this.task = this.solicitudesList[i];
        this._taskOdoo.cancelSOclient(this.task.So_id);
        this.presentLoading();
    }

    async presentLoading() {
        this.loading = await this.loadingController.create({
            cssClass: 'my-custom-class',
            message: 'Eliminando Solicitud...',
            //duration: 2000
        });

        return this.loading.present();
    }

    async presentLoadingCargado() {
        this.loading = await this.loadingController.create({
            cssClass: 'my-custom-class',
            message: 'Cargando Solicitudes...',
            //duration: 2000
        });
        return this.loading.present();
    }

    loadData(event) {
        this.tempLoadingSolicitud = event;
        this._taskOdoo.requestMoreApplicationTask();
    }
}
