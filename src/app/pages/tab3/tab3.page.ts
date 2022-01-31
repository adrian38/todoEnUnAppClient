import { Component } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { TaskOdooService } from 'src/app/services/task-odoo.service';

@Component({
    selector: 'app-tab3',
    templateUrl: 'tab3.page.html',
    styleUrls: ['tab3.page.scss'],
})
export class Tab3Page {
    constructor(public navCtrl: NavController) {
        /* this.platform.backButton.subscribeWithPriority(10, () => {
      this.navCtrl.navigateRoot('/tabs/tab1', {animated: true, animationDirection: 'back' }) ;
      }); */
    }

    ngOnInit(): void {
        //this._taskOdoo.setTab1In(true);
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        // this._taskOdoo.setTab1In(false);
    }

    datospersonales() {
        this.navCtrl.navigateRoot('/user-data', {
            animated: true,
            animationDirection: 'forward',
        });
    }

    cambiarcontrasea() {
        this.navCtrl.navigateRoot('/user-password', {
            animated: true,
            animationDirection: 'forward',
        });
    }
    promociones() {
        this.navCtrl.navigateRoot('/promotions', {
            animated: true,
            animationDirection: 'forward',
        });
    }
    somos() {
        this.navCtrl.navigateRoot('/about', { animated: true, animationDirection: 'forward' });
    }

    // clasificaciones() {
    //     this.navCtrl.navigateRoot('/clasificaciones', {
    //         animated: true,
    //         animationDirection: 'forward',
    //     });
    // }

    notificaciones() {
        this.navCtrl.navigateRoot('/notifications', {
            animated: true,
            animationDirection: 'forward',
        });
    }
}
