import { Component, NgZone, OnInit } from '@angular/core';
import { LoadingController, NavController, Platform } from '@ionic/angular';
import { MessageService } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { SignUpOdooService } from 'src/app/services/signup-odoo.service';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';

@Component({
    selector: 'app-user-password-lost',
    templateUrl: './user-password-lost.page.html',
    styleUrls: ['./user-password-lost.page.scss'],
})
export class UserPasswordLostPage implements OnInit {
    notificationOk$: Observable<boolean>;
    notificationError$: Observable<boolean>;

    subscriptionError: Subscription;
    subscriptionOk: Subscription;

    usuario: UsuarioModel;
    correo: string = '';
    deshabilitar: boolean = false;
    correo_vacio: boolean = false;
    loading: HTMLIonLoadingElement = null;

    constructor(
        public navCtrl: NavController,
        private platform: Platform,
        private ngZone: NgZone,
        public loadingController: LoadingController,
        private messageService: MessageService,
        private _signupOdoo: SignUpOdooService
    ) {
        this.usuario = new UsuarioModel();
    }

    ngOnInit() {
        this.platform.backButton.subscribeWithPriority(10, () => {
            this.navCtrl.navigateRoot('/login', { animated: true, animationDirection: 'back' });
        });

        this.notificationError$ = this._signupOdoo.getNotificationError$();
        this.subscriptionError = this.notificationError$.subscribe((notificationError) => {
            this.ngZone.run(() => {
                if (notificationError) {
                    this.deshabilitar = false;
                    this.loading.dismiss();
                    //this.presentToast("Error generando su link, vuelva a intentarlo");
                    this.messageService.add({
                        severity: 'error',
                        detail: 'Error de conexion o usuario no existe',
                    });

                    //this.navCtrl.navigateRoot('/login', { animated: true, animationDirection: 'back' });
                }
            });
        });

        this.notificationOk$ = this._signupOdoo.getNotificationOK$();
        this.subscriptionOk = this.notificationOk$.subscribe((notificationOk) => {
            this.ngZone.run(() => {
                this.sendEmail(this.usuario);
                //this._sigupOdoo.notificationPull();

                //this.loading.dismiss();
                if (notificationOk) {
                    this.deshabilitar = true;
                    // this.messageService.add({ severity: 'success', detail: 'Exito actualizando su usuario' });
                }
            });
        });
    }

    ngOnDestroy() {
        this.subscriptionError.unsubscribe();
        this.subscriptionOk.unsubscribe();
    }

    enviar() {
        if (this.correo != '') {
            this.correo_vacio = false;
            this.usuario.name = this.correo;
            this.usuario.password = this.generatePasswordRand();
            console.log(this.usuario.password);
            this.updatePassword(this.usuario);
            this.presentLoading();
        } else {
            this.correo_vacio = true;

            console.log('vacio');
            this.messageService.add({ severity: 'error', detail: 'No existe un correo valido' });
        }
    }

    generatePasswordRand() {
        let pass = '';
        let characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        for (let i = 0; i < 6; i++) {
            pass += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return pass;
    }

    sendEmail(usuario: UsuarioModel) {
        //e.preventDefault();
        emailjs
            .send(
                'service_p5za4js',
                'template_3uya4gs',
                {
                    message: usuario.password,
                    to_email: usuario.name,
                },
                'user_jIhzXiSh1jJAykrzaHzht'
            )
            .then(
                (result: EmailJSResponseStatus) => {
                    console.log(result.text);
                    this.loading.dismiss();
                    this.messageService.add({
                        severity: 'success',
                        detail: 'Se ha enviado la nuena contraseña a su correo',
                    });
                    setTimeout(() => {
                        this.navCtrl.navigateRoot('/login', {
                            animated: true,
                            animationDirection: 'back',
                        });
                    }, 2000);
                },
                (error) => {
                    this.loading.dismiss();
                    console.log(error.text);
                    this.messageService.add({
                        severity: 'error',
                        detail: 'No se ha generado la contraseña corrctamente',
                    });
                }
            );
    }

    updatePassword(usuario: UsuarioModel) {
        this._signupOdoo.updateUserPassword(usuario);
    }
    async presentLoading() {
        this.loading = await this.loadingController.create({
            cssClass: 'my-custom-class',
            message: 'Espere...',
            //duration: 2000
        });

        return this.loading.present();
    }
}
