import { Component, NgZone, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController, Platform } from '@ionic/angular';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthOdooService } from 'src/app/services/auth-odoo.service';
import { ChatOdooService } from 'src/app/services/chat-odoo.service';
import { TaskOdooService } from 'src/app/services/task-odoo.service';

import { Observable, Subscription } from 'rxjs';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    userObservable$: Observable<UsuarioModel>;
    userSubscription: Subscription;

    loading: HTMLIonLoadingElement = null;
    btn_disabled: boolean = false;
    user = new UsuarioModel();

    constructor(
        private _authOdoo: AuthOdooService,
        private _taskOdoo: TaskOdooService,
        private _chatOdoo: ChatOdooService,
        public ngZone: NgZone,
        public loadingController: LoadingController,
        public navController: NavController,
        public alertController: AlertController,
        public platform: Platform
    ) {}

    ngOnInit() {
        this.subscriptions();
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.userSubscription.unsubscribe();
    }

    subscriptions() {
        this.platform.backButton.subscribeWithPriority(10, () => {
            this.navController.navigateRoot('/home', {
                animated: true,
                animationDirection: 'back',
            });
        });

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
        if (this.loading) {
            this.loading.dismiss();
        }

        if (this.user.connected) {
            this._taskOdoo.setInitTab(false);
            this._taskOdoo.setUser(this.user);
            this._chatOdoo.setUser(this.user);

            //this._taskOdoo.requestTaskListClient();

            if (!this._taskOdoo.getInit()) {
                this._taskOdoo.setInit(true);
                this._taskOdoo.notificationPull();
            }

            sessionStorage.setItem('tutorial', 'false');
            this.btn_disabled = false;
            this.navController.navigateRoot('/task-new', {
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

    onSubmit() {
        this.btn_disabled = true;
        this.showLoading('Espere...');
        this._authOdoo.loginClientApk(this.user);
    }

    async showAlert() {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Usuario deshabilitado o mal escrito',
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

    async showLoading(message: string) {
        this.loading = await this.loadingController.create({
            cssClass: 'my-custom-class',
            message: message,
        });

        return this.loading.present();
    }

    forgottenPassword() {
        this.navController.navigateRoot('/user-password-lost', {
            animated: true,
            animationDirection: 'forward',
        });
    }
}
