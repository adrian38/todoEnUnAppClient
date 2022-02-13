import { Component } from '@angular/core';
import { AppUpdate } from '@ionic-native/app-update/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Platform } from '@ionic/angular';
import { PrimeNGConfig } from 'primeng/api';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
})
export class AppComponent {
    constructor(
        private primengConfig: PrimeNGConfig,
        private splashScreen: SplashScreen,
        private appUpdate: AppUpdate,
        private platform: Platform
    ) {
        this.initializeApp();
    }
    ngOnInit() {
        this.primengConfig.ripple = true;
    }
    initializeApp() {
        this.platform.ready().then(() => {
            //this.statusBar.styleDefault();
            this.splashScreen.hide();

            const updateUrl = 'https://todoenunapp.com/updateClientApk.xml';
            this.appUpdate
                .checkAppUpdate(updateUrl)
                .then((update) => {
                    alert('Update Status:  ' + update.msg);
                })
                .catch((error) => {
                    alert('Error: ' + error.msg);
                });
        });
    }
}
