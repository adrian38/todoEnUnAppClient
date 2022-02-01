import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { ObtSubSService } from 'src/app/services/obt-sub-s.service';

@Component({
    selector: 'app-task-new',
    templateUrl: './task-new.page.html',
    styleUrls: ['./task-new.page.scss'],
})
export class TaskNewPage implements OnInit {
    taskTypes: string[] = ['Fontaneria', 'Carpinteria', 'Electricidad', 'Masajes'];
    tutorial = sessionStorage.getItem('tutorial');

    constructor(
        private _serv: ObtSubSService,
        public platform: Platform,
        public navCtrl: NavController,
        public alertController: AlertController
    ) {}

    ngOnInit() {
        this.subscriptions();
    }

    subscriptions() {
        this.platform.backButton.subscribeWithPriority(10, () => {
            this.showAlert();
        });
    }

    taskSelected(selected: number) {
        this._serv.setServ(this.taskTypes[selected]);

        if (selected === 0) {
            document.getElementById('img').className = 'jello-horizontal';

            setTimeout(() => {
                this.navCtrl.navigateRoot('/task-subcategory', {
                    animated: true,
                    animationDirection: 'forward',
                });
            }, 800);
        } else {
            return;
        }

        /* this.navCtrl.navigateRoot('/titulo', {animated: true, animationDirection: 'forward' }) ;
         */
    }

    goToTasks() {
        this._serv.deleteFields();
        this.navCtrl.navigateRoot('/tabs/tab1', {
            animated: true,
            animationDirection: 'back',
        });
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
                    // handler: () => {
                    //     //console.log('Confirm Cancel: blah');
                    // },
                },
                {
                    text: 'Aceptar',
                    handler: () => {
                        this._serv.deleteFields();
                        this.navCtrl.navigateRoot('/tabs/tab1', {
                            animated: true,
                            animationDirection: 'back',
                        });
                    },
                },
            ],
        });

        await alert.present();
    }
}
