import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { ObtSubSService } from 'src/app/services/obt-sub-s.service';

@Component({
    selector: 'app-task-description',
    templateUrl: './task-description.page.html',
    styleUrls: ['./task-description.page.scss'],
})
export class TaskDescriptionPage implements OnInit {
    servicio: string = '';
    espacio: string = '  ';
    comentario: string = '';

    constructor(
        private _serv: ObtSubSService,
        public platform: Platform,
        public navCtrl: NavController,
        public alertCtrl: AlertController
    ) {}

    ngOnInit() {
        this.comentario = this._serv.getcomentario();
        this.servicio = this._serv.getServ();
        this.subscriptions();
    }

    subscriptions() {
        this.platform.backButton.subscribeWithPriority(10, () => {
            this.navCtrl.navigateRoot('/task-photos', {
                animated: true,
                animationDirection: 'back',
            });
        });
    }

    goto() {
        this._serv.setcomentario(this.comentario);

        this.navCtrl.navigateRoot('/task-location', {
            animated: true,
            animationDirection: 'forward',
        });
    }

    cerrarsolicitud() {
        this.showAlert();
    }

    async showAlert() {
        const alert = await this.alertCtrl.create({
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
