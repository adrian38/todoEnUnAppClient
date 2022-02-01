import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { ObtSubSService } from 'src/app/services/obt-sub-s.service';
import { TaskOdooService } from 'src/app/services/task-odoo.service';

@Component({
    selector: 'app-promotions',
    templateUrl: './promotions.page.html',
    styleUrls: ['./promotions.page.scss'],
})
export class PromotionsPage implements OnInit {
    promociones: Promociones[] = [
        {
            titulo: 'Promocion 1',
            text: 'De productos de albanileria',
        },
        {
            titulo: 'Promocion 2',
            text: 'De productos de albanileria',
        },
        {
            titulo: 'Promocion 3',
            text: 'De productos de albanileria',
        },
        {
            titulo: 'Promocion 4',
            text: 'De productos de albanileria',
        },
        {
            titulo: 'Promocion 5',
            text: 'De productos de albanileria',
        },
    ];

    constructor(
        private subServ: ObtSubSService,
        private navCtrl: NavController,
        private platform: Platform,
        private _taskOdoo: TaskOdooService
    ) {}

    ngOnInit() {
        this.subServ.setruta('promociones');
        this.platform.backButton.subscribeWithPriority(10, () => {
            this.navCtrl.navigateRoot('/tabs/tab3', { animated: true, animationDirection: 'back' });
        });

        this._taskOdoo.requestPromotionsList();
    }

    onFabClick() {
        console.log('Fab clicked');
    }

    showPromoInfo(i: number) {
        console.log('Promocion clicked', i);
        // this.navCtrl.navigateRoot('/promodetalles', { animated: true, animationDirection: 'back' });
    }

    detalles() {
        // this.navCtrl.navigateRoot('/promodetalles', { animated: true, animationDirection: 'back' });
    }
}

interface Promociones {
    titulo: string;
    text: string;
}
