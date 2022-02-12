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
import { TaskModel } from 'src/app/models/task.model';
import { TaskOdooService } from 'src/app/services/task-odoo.service';
import { ObtSubSService } from 'src/app/services/obt-sub-s.service';
import { MessageModel } from 'src/app/models/message.model';
import { ChatOdooService } from 'src/app/services/chat-odoo.service';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthOdooService } from 'src/app/services/auth-odoo.service';
import { Observable, Subscription } from 'rxjs';
import { PhotoService } from 'src/app/services/photo.service';
import { Photo } from 'src/app/Interfaces/interfaces';

import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-task-complaint',
    templateUrl: './task-complaint.page.html',
    styleUrls: ['./task-complaint.page.scss'],
})
export class TaskComplaintPage implements OnInit {
    task: TaskModel = new TaskModel();
    taskToSend: TaskModel = new TaskModel();
    comentario_evidencia: string = '';

    habilitar_0: boolean = true;
    habilitar_1: boolean = true;
    habilitar_2: boolean = true;
    imagen_0 = '../../../assets/images/noImage.svg ';
    imagen_1 = '../../../assets/images/noImage.svg ';
    imagen_2 = '../../../assets/images/noImage.svg ';

    foto1: string = '../../../assets/images/fotoadd.png';
    foto2: string = '../../../assets/images/fotoadd.png';
    foto3: string = '../../../assets/images/fotoadd.png';
    foto164: string = '../../../assets/images/fotoadd.png';
    foto264: string = '../../../assets/images/fotoadd.png';
    foto364: string = '../../../assets/images/fotoadd.png';
    finish: boolean = false;
    loading;

    notificationNewSoClient$: Observable<any>;
    notificationError$: Observable<any>;

    subscriptionNotificationNewSoClient: Subscription;
    subscriptionNotificationError: Subscription;

    constructor(
        private _taskOdoo: TaskOdooService,
        private navCtrl: NavController,
        private datos: ObtSubSService,
        private modalCtrl: ModalController,
        private platform: Platform,
        private _chatOdoo: ChatOdooService,
        private _authOdoo: AuthOdooService,
        private ngZone: NgZone,
        public loadingController: LoadingController,
        private alertCtrl: AlertController,
        public _photoService: PhotoService,
        private messageService: MessageService //private screenOrientation: ScreenOrientation
    ) {
        this.task = this._taskOdoo.getTaskCesar();
    }

    ngOnInit() {
        this.subscriptions();
    }

    ngOnDestroy(): void {
        this.subscriptionNotificationError.unsubscribe();
        this.subscriptionNotificationNewSoClient.unsubscribe();
    }

    subscriptions() {
        this.platform.backButton.subscribeWithPriority(10, () => {
            this.navCtrl.navigateRoot('/task-hired', {
                animated: true,
                animationDirection: 'back',
            });
        });

        this.notificationError$ = this._taskOdoo.getNotificationError$();
        this.subscriptionNotificationError = this.notificationError$.subscribe(
            (notificationError) => {
                this.ngZone.run(() => {
                    switch (notificationError.type) {
                        case 0:
                            if (this.loading) {
                                this.loading.dismiss();
                            }

                            this.messageService.add({
                                severity: 'error',
                                detail: 'Error en su conexión',
                            });
                            this.finish = false;
                            break;

                        case 8:
                            if (this.loading) {
                                this.loading.dismiss();
                            }
                            this.messageService.add({
                                severity: 'error',
                                detail: 'No se guardo la denuncia',
                            });
                            this.finish = false;
                            break;
                    }
                });
            }
        );

        this.notificationNewSoClient$ = this._taskOdoo.getRequestedTask$();
        this.subscriptionNotificationNewSoClient = this.notificationNewSoClient$.subscribe(
            (notificationNewSoClient) => {
                this.ngZone.run(() => {
                    switch (notificationNewSoClient.type) {
                        case 20:
                            if (this.loading) {
                                this.loading.dismiss();
                            }

                            this.messageService.add({
                                severity: 'success',
                                detail: 'Denuncia guardada correctamente',
                            });

                            this._taskOdoo.aplicationListEdit(this.task.So_id, 8);

                            setTimeout(() => {
                                this.navCtrl.navigateRoot('/tabs/tab2', {
                                    animated: true,
                                    animationDirection: 'back',
                                });
                            }, 2000);
                            break;
                    }
                });
            }
        );
    }

    onclickFoto1(posicion) {
        this.presentAlert(posicion);
    }
    async presentAlert(posicion) {
        try {
            let temp = await this._photoService.addNewToCamera();

            if (posicion == 0) {
                this.foto1 = temp;
            }
            if (posicion == 1) {
                this.foto1 = temp;
            }
            if (posicion == 2) {
                this.foto3 = temp;
            }
        } catch (e) {
            console.error('no photo');
        }
    }

    evidenciar() {
        if (
            (this.foto1 != '../../../assets/images/fotoadd.png' ||
                this.foto2 != '../../../assets/images/fotoadd.png' ||
                this.foto3 != '../../../assets/images/fotoadd.png') &&
            this.comentario_evidencia != ''
        ) {
            this.finish = true;

            this.task.complaint_description = this.comentario_evidencia;

            if (this.foto1 !== '/assets/images/fotoadd.png') {
                this.task.photoSO.push(this.datos.getfoto00());
            }
            if (this.foto2 !== '/assets/images/fotoadd.png') {
                this.task.photoSO.push(this.datos.getfoto11());
            }
            if (this.foto3 !== '/assets/images/fotoadd.png') {
                this.task.photoSO.push(this.datos.getfoto22());
            }

            this.presentLoading();
            this.taskToSend = { ...this.task };
            this.taskToSend.photoSO = [...this.task.photoSO];

            for (let [index, element] of this.taskToSend.photoSO.entries()) {
                if (
                    Buffer.from(element.substring(element.indexOf(',') + 1)).length / 1e6 >
                    0.322216
                ) {
                    this.resizedataURL(element, 1280, 960, index);
                } else {
                    element = element.substring(element.indexOf(',') + 1);
                }
            }

            this._taskOdoo.createComplaintClient(this.task);
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Coloque al menos una foto y su respectivo comentario.',
            });
        }
    }

    resizedataURL(datas, wantedWidth, wantedHeight, index) {
        //console.log(datas, 'como llega al resize');

        var img = document.createElement('img');
        img.src = datas;
        img.onload = () => {
            let ratio = img.width / img.height;
            wantedWidth = wantedHeight * ratio;
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');
            canvas.width = wantedWidth;
            canvas.height = wantedHeight;
            ctx.drawImage(img, 0, 0, wantedWidth, wantedHeight);
            let temp = canvas.toDataURL('image/jpeg', [0.0, 1.0]);
            this.task.complaint_Photo[index] = temp.substring(temp.indexOf(',') + 1);
        };
    }

    async presentLoading() {
        this.loading = await this.loadingController.create({
            cssClass: 'my-custom-class',
            message: 'Guardando su denuncia...',
        });

        return this.loading.present();
    }
}
