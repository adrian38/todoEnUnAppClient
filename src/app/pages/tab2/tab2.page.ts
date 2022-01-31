import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Address, TaskModel } from 'src/app/models/task.model';
import { MessageService } from 'primeng/api';
import { AuthOdooService } from 'src/app/services/auth-odoo.service';
import { ObtSubSService } from 'src/app/services/obt-sub-s.service';
import { TaskOdooService } from 'src/app/services/task-odoo.service';
import { IonSegment, NavController, Platform } from '@ionic/angular';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
    selector: 'app-tab2',
    templateUrl: 'tab2.page.html',
    styleUrls: ['tab2.page.scss'],
    providers: [MessageService],
})
export class Tab2Page {
    @ViewChild('segmentHist') segment: IonSegment;
    // @ViewChild("segmentHist", { read: ElementRef }) private mySegment: any;
    @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

    cant: number;
    id_string: string;
    task: TaskModel;

    contratadosList: TaskModel[];
    historialList: TaskModel[];

    verservicios: boolean = true;
    verhistorial: boolean = false;

    contratadoVacia: boolean = true;

    valorSegment: string;

    tasksList$: Observable<any>; // servicio comunicacion
    notificationError$: Observable<any>;

    subscriptiontasksList: Subscription;
    subscriptionsNotificationError: Subscription;

    tempLoadingSolicitud;

    constructor(
        private subServ: ObtSubSService,
        private _taskOdoo: TaskOdooService,
        private ngZone: NgZone,
        public navCtrl: NavController,
        private platform: Platform,
        private messageService: MessageService
    ) {
        this.verservicios = true;
        this.verhistorial = false;

        this.contratadosList = [];
        this.historialList = [];

        /*    this.platform.backButton.subscribeWithPriority(10, () => {
         this.navCtrl.navigateRoot('/tabs/tab1', {animated: true, animationDirection: 'back' }) ;
         }); */
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subscriptiontasksList.unsubscribe();
        this.subscriptionsNotificationError.unsubscribe();
    }

    ngAfterViewInit() {
        this.segment.value = 'servicio';
    }

    ngOnInit(): void {
        this.contratadosList = this._taskOdoo.getHiredList();
        this.historialList = this._taskOdoo.getRecordList();

        this.subscriptions();

        this.solicitudEmpty(this.contratadosList);

        console.log(this.contratadosList, 'contratadosList');
    }

    subscriptions() {
        // this.platform.backButton.subscribeWithPriority(10, () => {
        //   this.loading.dismiss();
        //   this.presentAlert();
        // });

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
                            //this.loading.dismiss();
                            break;

                        case 1:
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Error cargando sus Solicitudes.',
                            });
                            //this.loading.dismiss();
                            break;

                        case 2:
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Error cargando más Solicitudes.',
                            });
                            //this.loading.dismiss();
                            break;
                        case 3:
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Error eliminando la Solicitud.',
                            });
                            //this.loading.dismiss();
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
                switch (tasksList.type) {
                    case 0:
                        //!no hay solicitudes
                        // this.solicitudEmpty();
                        // this.loading.dismiss();
                        if (this.tempLoadingSolicitud) {
                            this.tempLoadingSolicitud.target.complete();
                        }

                        break;
                    case 1:
                        // this.solicitudEmpty();
                        // this.loading.dismiss();
                        this.contratadosList = this._taskOdoo.getApplicationList();
                        console.log(this.contratadosList);
                        break;

                    // case 9:

                    //   if (typeof this.contratadosList !== 'undefined' && this.contratadosList.length > 0) {

                    //     for (let i = 0; i < tasksList.task.length; i++) {

                    //       let temp = this.contratadosList.findIndex((element) => element.So_origin === tasksList.task[i]['origin']);

                    //       if (temp != -1) {

                    //         this.contratadosList[temp].notificationNewOffert = true;
                    //         //console.log(this.contratadosList);
                    //       }

                    //     }
                    //   }

                    //   break

                    case 12:
                        // if (typeof this.contratadosList !== 'undefined' && this.contratadosList.length > 0) {
                        //   for (let mess of tasksList.task) {

                        //     let temp = this.contratadosList.findIndex((element) => element.So_id === mess.SO_id);

                        //     if (temp != -1) {

                        //       this.contratadosList[temp].notificationNewChat = true;
                        //       //console.log(this.contratadosList);
                        //     }
                        //   }
                        // }

                        break;

                    case 14:
                        // this.solicitudEmpty();
                        // this.loading.dismiss();
                        this.contratadosList = this._taskOdoo.getHiredList();
                        //console.log(tasksList.task, "mas solicitudes llegando");

                        if (this.tempLoadingSolicitud) {
                            this.tempLoadingSolicitud.target.complete();
                        }

                        break;

                    case 20:
                        // this.solicitudEmpty();
                        // this.loading.dismiss();
                        this.historialList = this._taskOdoo.getRecordList();
                        //console.log(tasksList.task, "mas solicitudes llegando");

                        if (this.tempLoadingSolicitud) {
                            this.tempLoadingSolicitud.target.complete();
                        }

                        break;
                }
                // if (tasksList) {
                // 	this.contratadosList = this._taskOdoo.getSolicitudeList();
                // }
                // console.log(this.contratadosList,"tab1")

                // this.solicitudEmpty();
                // if (this.loading) {
                //   this.loading.dismiss();
                // }
            });
        });
    }

    solicitudEmpty(tempArray: TaskModel[]) {
        if (typeof tempArray !== 'undefined' && tempArray.length > 0) {
            this.contratadoVacia = false;
        } else {
            this.contratadoVacia = true;
        }
    }

    in(i: number) {
        this.cant = i;
        this.subServ.setposicion(this.cant);

        this.task = this.contratadosList[this.cant];
        this._taskOdoo.setTaskCesar(this.task);
        this.subServ.setidString(this.id_string);
        this.subServ.setruta('tabs/tab2');
        this.navCtrl.navigateRoot('/task-hired', {
            animated: true,
            animationDirection: 'forward',
        });
    }

    // inhistorial(j: number) {
    //   //Aqui hay cosas que arreglar*******

    //   this.subServ.setposicion(j);

    //   this.task = this.contratadosList[j];
    //   this._taskOdoo.setTaskCesar(this.task);

    //   this.navCtrl.navigateRoot('/histdetalle', { animated: true, animationDirection: 'back' });

    // }

    segChange(event) {
        this.valorSegment = event.detail.value;

        if (this.valorSegment === 'servicio') {
            this.verservicios = true;
            this.verhistorial = false;

            this.solicitudEmpty(this.contratadosList);
        }

        if (this.valorSegment === 'historial') {
            this.verservicios = false;
            this.verhistorial = true;

            this.solicitudEmpty(this.historialList);
        }
    }

    loadData(event) {
        this.tempLoadingSolicitud = event;
        if (this.valorSegment === 'servicio') {
            this._taskOdoo.requestMoreHiredTask();
        } else {
            this._taskOdoo.requestMoreRecordTask();
        }
    }
}
