import { Component, NgZone, OnInit } from '@angular/core';
import { NavController, LoadingController, Platform, ModalController } from '@ionic/angular';
import { ObtSubSService } from 'src/app/services/obt-sub-s.service';
import { TaskOdooService } from 'src/app/services/task-odoo.service';
import { AuthOdooService } from 'src/app/services/auth-odoo.service';
import { Address, TaskModel } from '../../models/task.model';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { DatePipe } from '@angular/common';
//import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

//-----------------------------------------------
import { ActionSheetController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { PhotoService } from '../../services/photo.service';
import { Observable, Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { DomSanitizer } from '@angular/platform-browser';
import { ImagenmodalPage } from '../imagenmodal/imagenmodal.page';
import { Router } from '@angular/router';

@Component({
    selector: 'app-task-abstract',
    templateUrl: './task-abstract.page.html',
    styleUrls: ['./task-abstract.page.scss'],
    providers: [MessageService],
})
export class TaskAbstractPage implements OnInit {
    user: UsuarioModel = new UsuarioModel();
    task: TaskModel = new TaskModel();
    taskToSend;

    btn_deshabilitar: boolean = false;
    servicio: string = '';
    loading;

    notificationNewSoClient$: Observable<any>;
    notificationError$: Observable<any>;

    subscriptionNotificationNewSoClient: Subscription;
    subscriptionNotificationError: Subscription;

    habilitar_0: boolean = true;
    habilitar_1: boolean = true;
    habilitar_2: boolean = true;

    constructor(
        private datos: ObtSubSService,
        private date: DatePipe,
        private _taskOdoo: TaskOdooService,
        private ngZone: NgZone,
        public navCtrl: NavController,
        private platform: Platform,
        private messageService: MessageService,
        public alertCtrl: AlertController,
        public loadingController: LoadingController,
        private _authOdoo: AuthOdooService,
        private modalCtrl: ModalController,
        private router: Router //private screenOrientation: ScreenOrientation
    ) {
        this.task.address = new Address('', '', '', '', '', '', '', '', '', 0);
        this.user = this._authOdoo.getUser();
    }

    ngOnInit() {
        //this.screenOrientation.lock('portrait');

        this.servicio = this.datos.getServ();
        this.task.require_materials = this.datos.getUtiles();
        this.task.description = this.datos.getcomentario();
        this.task.address.street = this.datos.getcalle();
        this.task.address.door = this.datos.getpuerta();
        this.task.address.stair = this.datos.getescalera();
        this.task.address.portal = this.datos.getportal();
        this.task.address.cp = this.datos.getcod_postal();
        this.task.address.number = this.datos.getnumero();
        this.task.address.floor = this.datos.getpiso();
        this.task.address.latitude = String(this.datos.getlatitud());
        this.task.address.longitude = String(this.datos.getlongitud());
        this.task.title = this.datos.gettitulo();
        this.task.product_id = 39;
        this.task.type = 'Servicio de Fontaneria';
        //this.task.date_planned = this.datos.getCalendarioD();
        //this.task.time = this.date.transform(this.datos.getCalendarioT(), 'HH:mm:ss');
        //this.task.time = this.datos.getCalendarioT().toString();
        this.task.client_id = this.user.partner_id;

        if (this.datos.getfoto00() !== '/assets/images/fotoadd.png') {
            this.task.photoSO.push(this.datos.getfoto00());
        }
        if (this.datos.getfoto11() !== '/assets/images/fotoadd.png') {
            this.task.photoSO.push(this.datos.getfoto11());
        }
        if (this.datos.getfoto22() !== '/assets/images/fotoadd.png') {
            this.task.photoSO.push(this.datos.getfoto22());
        }

        //console.log(this.task.photoSO);

        this.disableImages();
        this.subscriptions();
    }

    subscriptions() {
        this.platform.backButton.subscribeWithPriority(10, () => {
            this.navCtrl.navigateRoot('/task-photos', {
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
                            this.loading.dismiss();
                            this.messageService.add({
                                severity: 'error',
                                detail: 'Error en su conexión',
                            });
                            this.btn_deshabilitar = false;
                            break;

                        case 8:
                            this.loading.dismiss();
                            this.messageService.add({
                                severity: 'error',
                                detail: 'No se creo la tarea',
                            });
                            this.btn_deshabilitar = false;
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
                        case 7:
                            this.loading.dismiss();
                            console.log('tarea creada correctamente');
                            this.messageService.add({
                                severity: 'success',
                                detail: 'Tarea creada correctamente',
                            });
                            this.datos.deleteFields();
                            setTimeout(() => {
                                this.navCtrl.navigateRoot('/tabs/tab1', {
                                    animated: true,
                                    animationDirection: 'forward',
                                });
                            }, 2000);
                            break;
                    }
                });
            }
        );
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

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subscriptionNotificationError.unsubscribe();
        this.subscriptionNotificationNewSoClient.unsubscribe();
    }

    cerrarsolicitud() {
        this.presentAlert();
    }
    crearSolicitud() {
        this.presentLoading();

        this.taskToSend = { ...this.task };
        this.taskToSend.photoSO = [...this.task.photoSO];
        console.log('before', this.taskToSend);

        for (let [index, element] of this.taskToSend.photoSO.entries()) {
            if (Buffer.from(element.substring(element.indexOf(',') + 1)).length / 1e6 > 0.322216) {
                this.resizedataURL(element, 1280, 960, index);
            } else {
                element = element.substring(element.indexOf(',') + 1);
            }
        }

        // this.taskToSend.time = this.date.transform(this.datos.getCalendarioT(), 'HH:mm:ss');

        //console.log(this.taskToSend, 'tarea a crear');
        this.btn_deshabilitar = true;
        this._taskOdoo.newTask(this.taskToSend);
    }

    onClickLocation() {
        //this.datos.setMapType(false);
        this.datos.setruta(this.router.url);
        this.navCtrl.navigateRoot('/map-detail', {
            animated: true,
            animationDirection: 'back',
        });
    }

    async presentAlert() {
        const alert = await this.alertCtrl.create({
            cssClass: 'my-custom-class',
            header: 'Alerta',
            message: 'Desea cancelar la solicitud',

            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                        console.log('Confirm Cancel: blah');
                    },
                },
                {
                    text: 'Aceptar',
                    handler: (datos) => {
                        this.datos.deleteFields();
                        this.navCtrl.navigateRoot('/tabs/tab1', {
                            animated: true,
                            animationDirection: 'forward',
                        });
                    },
                },
            ],
        });

        await alert.present();
    }

    async presentLoading() {
        this.loading = await this.loadingController.create({
            cssClass: 'my-custom-class',
            message: 'Creando Solicitud...',
        });

        return this.loading.present();
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
            this.taskToSend.photoSO[index] = temp.substring(temp.indexOf(',') + 1);
        };
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
}
