import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { ObtSubSService } from 'src/app/services/obt-sub-s.service';

@Component({
    selector: 'app-task-materials',
    templateUrl: './task-materials.page.html',
    styleUrls: ['./task-materials.page.scss'],
})
export class TaskMaterialsPage implements OnInit {
    taskType: string = '';
    checkSi: boolean = false;
    checkNo: boolean = true;

    constructor(
        private _serv: ObtSubSService,
        public navCtrl: NavController,
        private platform: Platform,
        public alertCtrl: AlertController
    ) {
        this.taskType = this._serv.getServ();
    }

    checkSiF() {
        this.checkNo = false;
        this.checkSi = true;
    }
    checkNoF() {
        this.checkNo = true;
        this.checkSi = false;
    }

    ngOnInit() {
        this.subscriptions();
    }

    subscriptions() {
        this.platform.backButton.subscribeWithPriority(10, () => {
            // if (ruta == 'option') {
            this.navCtrl.navigateRoot('/task-subcategory', {
                animated: true,
                animationDirection: 'back',
            });
            //     } else {
            //         this.navCtrl.navigateRoot('/titulo', {
            //             animated: true,
            //             animationDirection: 'back',
            //         });
            //     }
        });
    }

    materialSelected() {
        // this.datos.setTitulo(this.titulo);
        this._serv.setUtiles(this.checkSi);
        this.navCtrl.navigateRoot('/task-photos', {
            animated: true,
            animationDirection: 'forward',
        });
    }

    backButton() {
        this.navCtrl.navigateRoot('/task-subcategory', {
            animated: true,
            animationDirection: 'forward',
        });
    }

    cerrarsolicitud() {
        this.presentAlert();
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
