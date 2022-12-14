import { Component, NgZone, OnInit } from '@angular/core';
import { TaskOdooService } from 'src/app/services/task-odoo.service';
// import { MessageModel } from 'src/app/models/message.model';
import { TaskModel } from 'src/app/models/task.model';
import { ChatOdooService } from 'src/app/services/chat-odoo.service';
// import { Observable, Subscription } from 'rxjs';
import { ModalController, NavController, Platform, LoadingController } from '@ionic/angular';
import { ObtSubSService } from 'src/app/services/obt-sub-s.service';

@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.page.html',
    styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
    notificaciones: TaskModel[] = [];
    temNoti: TaskModel = new TaskModel();

    tempNotificaciones: any[] = [];

    loading: any;
    newchat: number[];

    constructor(
        private _taskOdoo: TaskOdooService,
        // private ngZone: NgZone,
        // private _chatOdoo: ChatOdooService,
        private platform: Platform,
        private navCtrl: NavController,
        private subServ: ObtSubSService,
        public loadingController: LoadingController
    ) {}

    ngOnInit() {
        this.subscriptions();
        this._taskOdoo.setNotification(false);
        this.tempNotificaciones = this._taskOdoo.getNoificationArray();

        for (let noti of this.tempNotificaciones) {
            switch (noti.type) {
                case 1:
                    //!Costos extras
                    break;

                case 2:
                    //!nueva oferta
                    let tempOffer: TaskModel = new TaskModel();
                    if (noti.upload == 1) {
                        tempOffer.notificationType = 6;
                        tempOffer.title = 'Tiene nuevas ofertas';
                        this.notificaciones.push(tempOffer);
                    } else {
                        for (let mess of noti.task) {
                            if (noti.upload == 0) {
                                //console.log("funcion", (this._taskOdoo.searchTittleSo(mess.SO_id).title.slice(0, 18)).toLowerCase() + ' ... ');
                                tempOffer.title = this._taskOdoo.searchTittleSo(mess.origin, true).title;
                                if (tempOffer.title.length > 30) {
                                    tempOffer.title = 'En la solicitud' + tempOffer.title.slice(0, 30) + ' ... ';
                                }
                                tempOffer.notificationType = 2;
                                this.notificaciones.push(tempOffer);
                            }
                        }
                    }

                    break;

                case 3:
                    let temp: TaskModel = new TaskModel();
                    if (noti.upload == 1) {
                        temp.notificationType = 5;
                        temp.title = 'Tiene nuevos mensajes';
                        this.notificaciones.push(temp);
                    } else {
                        for (let mess of noti.task) {
                            temp.title = this._taskOdoo.searchTittleSo(mess.SO_id, false).title;
                            if (temp.title.length > 30) {
                                temp.title = 'En la solicitud' + temp.title.slice(0, 30) + ' ... ';
                            }

                            temp.notificationType = 3;
                            this.notificaciones.push(temp);
                        }
                    }

                    //console.log("resultado", this.notificaciones);
                    break;

                case 4:
                    //!Promociones
                    break;
            }
        }
    }
    ngOnDestroy() {}

    cerrarsolicitud() {
        console.log('*************this._taskOdoo.getRoute()  *************');
        console.log(this._taskOdoo.getRoute());

        this.navCtrl.navigateRoot(this._taskOdoo.getRoute(), {
            animated: true,
            animationDirection: 'back',
        });
    }

    async presentLoadingCargado() {
        this.loading = await this.loadingController.create({
            cssClass: 'my-custom-class',
            message: 'Cargando Notificaciones...',
            //duration: 2000
        });
        return this.loading.present();
    }

    subscriptions() {
        this.platform.backButton.subscribeWithPriority(10, () => {
            this.navCtrl.navigateRoot(this._taskOdoo.getRoute(), {
                animated: true,
                animationDirection: 'back',
            });
        });
    }

    detalles() {
        this.navCtrl.navigateRoot('/promodetalles', { animated: true, animationDirection: 'back' });
    }
}
