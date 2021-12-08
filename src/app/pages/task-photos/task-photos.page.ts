import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, NavController, Platform } from '@ionic/angular';
import { ObtSubSService } from 'src/app/services/obt-sub-s.service';
import { PhotoService } from 'src/app/services/photo.service';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
// import { Photo } from 'src/app/interfaces/interfaces';

@Component({
    selector: 'app-task-photos',
    templateUrl: './task-photos.page.html',
    styleUrls: ['./task-photos.page.scss'],
})
export class TaskPhotosPage implements OnInit {
    foto0: string = '';
    foto1: string = '';
    foto2: string = '';
    foto064: string = '';
    foto164: string = '';
    foto264: string = '';

    servicio: string = '';

    constructor(
        private _serv: ObtSubSService,
        public navCtrl: NavController,
        public _photoService: PhotoService,
        public actionSheetController: ActionSheetController,
        public alertController: AlertController,
        public platform: Platform
    ) {
        this.servicio = this._serv.getServ();
    }

    ngOnInit() {
        defineCustomElements(window);
        this.foto0 = this._serv.getfoto00();
        this.foto1 = this._serv.getfoto11();
        this.foto2 = this._serv.getfoto22();
        this.subscriptions();
    }
    cerrarsolicitud() {
        this.showAlert();
    }

    subscriptions() {
        this.platform.backButton.subscribeWithPriority(10, () => {
            this.navCtrl.navigateRoot('/task-materials', {
                animated: true,
                animationDirection: 'back',
            });
        });
    }

    goto() {
        this.navCtrl.navigateRoot('/task-description', {
            animated: true,
            animationDirection: 'forward',
        });
    }

    async takePhoto(posc: number) {
        let temp = await this._photoService.addNewToCamera();

        if (posc == 0) {
            this.foto0 = temp;
            this._serv.setfoto00(temp);
        }
        if (posc == 1) {
            this.foto1 = temp;
            this._serv.setfoto11(temp);
        }
        if (posc == 2) {
            this.foto2 = temp;
            this._serv.setfoto22(temp);
        }
    }

    async showAlert() {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Alerta',
            message: 'Desea cancelar la solicitud',

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
                        this._serv.deleteFields();
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
}
