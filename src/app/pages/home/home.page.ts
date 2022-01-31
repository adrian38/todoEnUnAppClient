import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
    test1 = 5;

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        public alertController: AlertController,
        private navController: NavController
    ) {}

    ngOnInit() {
        this.subscriptions();
    }

    subscriptions() {
        this.platform.ready().then(() => {
            this.splashScreen.hide();
        });

        this.platform.backButton.subscribeWithPriority(10, () => {
            this.showExitAlert();
        });

        this.platform.backButton.subscribeWithPriority(5, () => {
            this.alertController
                .getTop()
                .then((r) => {
                    if (r) {
                        navigator['app'].exitApp();
                    }
                })
                .catch((e) => {});
        });
    }

    showExitAlert() {
        this.alertController
            .create({
                header: 'Alerta',
                message: 'Desea salir de la aplicación?',
                backdropDismiss: false,
                buttons: [
                    {
                        text: 'Cancelar',
                        role: 'cancel',
                        handler: () => {},
                    },
                    {
                        text: 'Salir',
                        handler: () => {
                            navigator['app'].exitApp();
                        },
                    },
                ],
            })
            .then((alert) => {
                alert.present();
            });
    }

    browseLogin() {
        sessionStorage.setItem('tutorial', 'false');
        this.navController.navigateRoot('/login', {
            animated: true,
            animationDirection: 'back',
        });
    }

    showTutorial() {
        console.log('tutorial');

        sessionStorage.setItem('tutorial', 'true');
        this.navController.navigateRoot('/tutorial-options', {
            animated: true,
            animationDirection: 'forward',
        });
    }
}
