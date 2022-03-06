import { Component, NgZone, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController, Platform } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthOdooService } from 'src/app/services/auth-odoo.service';
import { ChatOdooService } from 'src/app/services/chat-odoo.service';
import { TaskOdooService } from 'src/app/services/task-odoo.service';
//import { SplashScreen } from '@ionic-native/splash-screen/ngx';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
    userObservable$: Observable<UsuarioModel>;
    userSubscription: Subscription;

    loading: HTMLIonLoadingElement = null;
    btn_disabled: boolean = false;
    user = new UsuarioModel();

    constructor(
        private platform: Platform,
        // private splashScreen: SplashScreen,
        public alertController: AlertController,
        private navController: NavController,
        private _authOdoo: AuthOdooService,
        private _taskOdoo: TaskOdooService,
        private _chatOdoo: ChatOdooService,
        public ngZone: NgZone,
        public loadingController: LoadingController
    ) {
        this.user.username = 'anonimo@example.com';
        this.user.password = 'anonimo';
    }

    ngOnInit() {
        this.subscriptions();
    }

    subscriptions() {
        this.platform.backButton.subscribeWithPriority(10, () => {
            this.showExitAlert();
        });

        // this.platform.backButton.subscribeWithPriority(5, () => {
        //     this.alertController
        //         .getTop()
        //         .then((r) => {
        //             if (r) {
        //                 navigator['app'].exitApp();
        //             }
        //         })
        //         .catch((e) => {});
        // });

        this.userObservable$ = this._authOdoo.getUser$();
        this.userSubscription = this.userObservable$.subscribe((user) => {
            this.ngZone.run(() => {
                this.user = user;
                if (this.loading) {
                    this.loading.dismiss();
                }
                this.checkUser();
            });
        });
    }

    checkUser() {
        if (this.user.connected) {
            this._taskOdoo.setInitTab(false);
            this._taskOdoo.setUser(this.user);
            this._chatOdoo.setUser(this.user);

            //this._taskOdoo.requestTaskListClient();

            if (!this._taskOdoo.getInit()) {
                this._taskOdoo.setInit(true);
                this._taskOdoo.notificationPull();
            }

            this.btn_disabled = false;

            sessionStorage.setItem('tutorial', 'true');
            this.navController.navigateRoot('/tutorial-options', {
                animated: true,
                animationDirection: 'forward',
            });
        } else {
            this.loading.dismiss();
            switch (this.user.error) {
                case 4:
                    this.btn_disabled = false;
                    this.showAlert();
                    break;

                default:
            }
        }
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

    async showLoading(message: string) {
        this.loading = await this.loadingController.create({
            cssClass: 'my-custom-class',
            message: message,
        });

        return this.loading.present();
    }

    browseLogin() {
        sessionStorage.setItem('tutorial', 'false');
        this.navController.navigateRoot('/login', {
            animated: true,
            animationDirection: 'back',
        });
    }

    signUp() {
        this.navController.navigateRoot('/registration-contract', {
            animated: true,
            animationDirection: 'back',
        });
    }

    showTutorial() {
        this.btn_disabled = true;
        this.showLoading('Espere...');
        this._authOdoo.loginClientApk(this.user);
    }

    async showAlert() {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Error desconocido',
            message: 'Si el problema persiste contactar con la administración',
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    cssClass: 'secondary',
                    //handler: () => {},
                },
            ],
        });

        await alert.present();
    }
}
