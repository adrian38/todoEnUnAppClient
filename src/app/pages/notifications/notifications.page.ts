import { Component, NgZone, OnInit } from '@angular/core';
import { TaskOdooService } from 'src/app/services/task-odoo.service';
import { MessageModel } from 'src/app/models/message.model';
import { TaskModel } from 'src/app/models/task.model';
import { ChatOdooService } from 'src/app/services/chat-odoo.service';
import { Observable, Subscription } from 'rxjs';
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

    tempNotificaciones: any;

    loading: any;
    newchat: number[];

    constructor(
        private _taskOdoo: TaskOdooService,
        private ngZone: NgZone,
        private _chatOdoo: ChatOdooService,
        private platform: Platform,
        private navCtrl: NavController,
        private subServ: ObtSubSService,
        public loadingController: LoadingController
    ) {}

    ngOnInit() {
        this._taskOdoo.setNotification(false);
        this.tempNotificaciones = this._taskOdoo.getNoificationArray();

        console.log(this.tempNotificaciones);

        for (let noti of this.tempNotificaciones) {
            switch (noti.type) {
                case 1:
                    //!Costos extras
                    break;

                case 2:
                    //!nueva oferta

                    for (let mess of noti.task) {
                        if (noti.upload == 0) {
                            //console.log("funcion", (this._taskOdoo.searchTittleSo(mess.SO_id).title.slice(0, 18)).toLowerCase() + ' ... ');
                            this.temNoti.title =
                                this._taskOdoo
                                    .searchTittleSo(mess.SO_id)
                                    .title.slice(0, 18)
                                    .toLowerCase() + ' ... ';
                            this.temNoti.notificationType = 2;
                            this.notificaciones.push(this.temNoti);
                        } else {
                            //console.log("todavia no se ha cargado",(this._taskOdoo.searchTittleSo(mess.SO_id).title.slice(0, 18)).toLowerCase() + ' ... ');
                            this.temNoti.notificationType = 6;
                            this.notificaciones.push(this.temNoti);
                        }
                    }

                    break;

                case 3:
                    console.log('tengo un chat');
                    //!nuevo chat
                    for (let mess of noti.task) {
                        if (noti.upload == 0) {
                            //console.log("funcion", this._taskOdoo.searchTittleSo(mess.SO_id).title);
                            this.temNoti.title =
                                this._taskOdoo
                                    .searchTittleSo(mess.SO_id)
                                    .title.slice(0, 18)
                                    .toLowerCase() + ' ... ';
                            this.temNoti.notificationType = 3;
                            this.notificaciones.push(this.temNoti);
                        } else {
                            //console.log("todavia no se ha cargado");
                            this.temNoti.notificationType = 5;
                            this.notificaciones.push(this.temNoti);
                        }
                    }

                    //console.log("resultado", this.notificaciones);
                    break;

                case 4:
                    //!Promociones
                    break;
            }
        }

        this.subscriptions();
    }
    ngOnDestroy() {}

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
            this.navCtrl.navigateRoot(this.subServ.getruta(), {
                animated: true,
                animationDirection: 'back',
            });
        });
    }

    detalles() {
        this.navCtrl.navigateRoot('/promodetalles', { animated: true, animationDirection: 'back' });
    }
}
