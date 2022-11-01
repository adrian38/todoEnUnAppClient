import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { TaskModel } from 'src/app/models/task.model';
import { ObtSubSService } from 'src/app/services/obt-sub-s.service';

@Component({
    selector: 'app-task-title',
    templateUrl: './task-title.page.html',
    styleUrls: ['./task-title.page.scss'],
})
export class TaskTitlePage implements OnInit {
    titulo: boolean = false;
    title: string = '';
    titulo_vacio: boolean = false;
    checkSi: boolean = false;
    checkNo: boolean = true;
    validado: boolean = true;
    servicio: string = '';
    task: TaskModel;

    constructor(
        private _serv: ObtSubSService,
        public navCtrl: NavController,
        private platform: Platform,
        public alertCtrl: AlertController
    ) {}

    ngOnInit() {
        this.servicio = this._serv.getServ();

        this.title = this._serv.gettitulo();

        this.platform.backButton.subscribeWithPriority(10, () => {
            this.navCtrl.navigateRoot('/option', { animated: true, animationDirection: 'back' });
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
                    handler: (_serv) => {
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

    goto() {
        if (this.title != '') {
            this.titulo_vacio = false;
        } else {
            this.titulo_vacio = true;
        }

        if (!this.titulo_vacio) {
            this._serv.setTitulo(this.title);

            this.navCtrl.navigateRoot('/task-materials', {
                animated: true,
                animationDirection: 'forward',
            });
        } else {
            console.log('title empthy');
        }
    }
}
