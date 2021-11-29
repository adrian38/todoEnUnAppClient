import { Component, ViewChild } from '@angular/core';

import {
    AlertController,
    IonTabs,
    LoadingController,
    NavController,
    Platform,
} from '@ionic/angular';

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss'],
})
export class TabsPage {
    @ViewChild('tabs') tabs: IonTabs;

    tab1_active: string = '';
    tab2_active: string = '';
    tab3_active: string = '';

    constructor(
        public alertCtrl: AlertController,
        public loadingController: LoadingController,
        public navCtrl: NavController,
        private platform: Platform
    ) {}

    setCurrentTab(event) {
        let selectedTab = this.tabs.getSelected();

        if (selectedTab === 'tab1') {
            this.tab1_active = '_active';
            this.tab2_active = '';
            this.tab3_active = '';
            this.platform.backButton.subscribeWithPriority(10, () => {
                this.presentAlert();
            });
        } else if (selectedTab === 'tab2') {
            this.tab1_active = '';
            this.tab2_active = '_active';
            this.tab3_active = '';
            this.platform.backButton.subscribeWithPriority(10, () => {
                this.navCtrl.navigateRoot('/tabs/tab1', {
                    animated: true,
                    animationDirection: 'back',
                });
            });
        } else if (selectedTab === 'tab3') {
            this.tab1_active = '';
            this.tab2_active = '';
            this.tab3_active = '_active';
            this.platform.backButton.subscribeWithPriority(10, () => {
                this.navCtrl.navigateRoot('/tabs/tab1', {
                    animated: true,
                    animationDirection: 'back',
                });
            });
        }
    }

    async presentAlert() {
        const alert = await this.alertCtrl.create({
            cssClass: 'my-custom-class',
            header: 'Alerta',
            message: 'Desea registrarse con otro usuario',

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
                        this.navCtrl.navigateRoot('/login', {
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
