import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { TaskModel } from 'src/app/models/task.model';
import { Observable, Subscription } from 'rxjs';
import { ObtSubSService } from 'src/app/services/obt-sub-s.service';
import { TaskOdooService } from 'src/app/services/task-odoo.service';
import { UsuarioModel } from 'src/app/models/usuario.model';
import {
    AlertController,
    LoadingController,
    NavController,
    Platform,
    IonInfiniteScroll,
} from '@ionic/angular';
import { MessageService } from 'primeng/api';
import { Location } from '@angular/common';
//import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { ChatOdooService } from 'src/app/services/chat-odoo.service';

@Component({
    selector: 'app-tutorial-requests',
    templateUrl: './tutorial-requests.page.html',
    styleUrls: ['./tutorial-requests.page.scss'],
})
export class TutorialRequestsPage implements OnInit {
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

    user = new UsuarioModel();

    jaysonServer = {
        //host: '192.168.0.102',
        //host: '192.168.0.107',
        host: 'odoo.todoenunapp.com',
        //host: 'localhost',
        port: '443',
        //port: '8069',
        db: 'demo',
        username: 'anonimo@example.com',
        password: 'anonimo',
        pathConnection: '/jsonrpc',
    };

    //@ViewChild('tabs') tabs: IonTabs;
    @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

    constructor(
        private subServ: ObtSubSService,
        private _taskOdoo: TaskOdooService,
        private _chatOdoo: ChatOdooService,
        private ngZone: NgZone,
        public navCtrl: NavController,
        private platform: Platform,
        public alertCtrl: AlertController,
        private messageService: MessageService,
        public loadingController: LoadingController,

        private _location: Location
    ) //private splashScreen: SplashScreen
    {
        this.user.id = 129;
        this.user.partner_id = 217;
        this.user.password = 'anonimo';
        this.user.username = 'anonimo@example.com';
    }

    ngOnInit(): void {
        this.subscriptions();
        this.init();
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subscriptiontasksList.unsubscribe();
        this.subscriptionsNotificationError.unsubscribe();
    }

    init() {
        if (!this._taskOdoo.getInit()) {
            this._taskOdoo.setInit(true);
            this._taskOdoo.setUserAnonimus(this.user, this.jaysonServer);
            this._chatOdoo.setUserAnonimus(this.user, this.jaysonServer);
            this._taskOdoo.notificationPull();
            this._taskOdoo.requestApplicationTaskAnonimus();
            this.presentLoadingCargado();
        } else {
            //console.log("ya habia entrado",this._taskOdoo.getApplicationList())
            this.solicitudesList = this._taskOdoo.getApplicationList();
        }
    }

    subscriptions() {
        this.platform.backButton.subscribeWithPriority(10, () => {
            this.navCtrl.navigateRoot('/tutorial-options', {
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

                        break;
                    case 1:
                        this.solicitudesList = this._taskOdoo.getApplicationList();
                        // console.log('************* solicitudesList *************');
                        // console.log(this.solicitudesList);

                        break;

                    case 2:
                        this.solicitudesList = [].concat(this.solicitudesList, tasksList.task);

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
        this.task = this.solicitudesList[i];
        this._taskOdoo.setTaskCesar(this.task);
        this.navCtrl.navigateRoot('/tutorial-request-detail', {
            animated: true,
            animationDirection: 'forward',
        });
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
        this._taskOdoo.requestMoreApplicationTaskAnonimus();
    }
}
