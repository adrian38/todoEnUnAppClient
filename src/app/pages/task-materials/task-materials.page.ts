import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
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
        private platform: Platform
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
}
