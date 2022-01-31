import { Component, NgZone, OnInit } from '@angular/core';
import { LoadingController, NavController, Platform, ToastController } from '@ionic/angular';
import { MessageService } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthOdooService } from 'src/app/services/auth-odoo.service';
import { ChatOdooService } from 'src/app/services/chat-odoo.service';
import { SignUpOdooService } from 'src/app/services/signup-odoo.service';
import { TaskOdooService } from 'src/app/services/task-odoo.service';

@Component({
    selector: 'app-user-password',
    templateUrl: './user-password.page.html',
    styleUrls: ['./user-password.page.scss'],
})
export class UserPasswordPage implements OnInit {
    cambiada: string = '';
    confirmada: string = '';
    confirmacion_pass: boolean = false;
    campos_vacios: boolean = false;

    notificationOk$: Observable<boolean>;
    notificationError$: Observable<boolean>;

    subscriptionError: Subscription;
    subscriptionOk: Subscription;

    usuario: UsuarioModel;
    loading: HTMLIonLoadingElement = null;
    deshabilitar: boolean = false;

    constructor(
        public navCtrl: NavController,
        private platform: Platform,
        private messageService: MessageService,
        public toastController: ToastController,
        private _signupOdoo: SignUpOdooService,
        public _authOdoo: AuthOdooService,
        private ngZone: NgZone,
        public loadingController: LoadingController,
        private _chatOdoo: ChatOdooService,
        private _taskOdoo: TaskOdooService
    ) {
        this.usuario = new UsuarioModel();
    }

    ngOnInit() {
        this.platform.backButton.subscribeWithPriority(10, () => {
            this.navCtrl.navigateRoot('/tabs/tab3', { animated: true, animationDirection: 'back' });
        });

        this.usuario = this._authOdoo.getUser();

        console.log(this.usuario);

        this.notificationError$ = this._signupOdoo.getNotificationError$();
        this.subscriptionError = this.notificationError$.subscribe((notificationError) => {
            this.ngZone.run(() => {
                if (notificationError) {
                    this.loading.dismiss();
                    //this.presentToast("Error generando su link, vuelva a intentarlo");
                    this.messageService.add({
                        severity: 'error',
                        detail: 'Error actualizando su usuario',
                    });
                    this.deshabilitar = false;
                }
            });
        });

        this.notificationOk$ = this._signupOdoo.getNotificationOK$();
        this.subscriptionOk = this.notificationOk$.subscribe((notificationOk) => {
            this.ngZone.run(() => {
                //this._sigupOdoo.notificationPull();

                this.loading.dismiss();
                if (notificationOk) {
                    this.messageService.add({
                        severity: 'success',
                        detail: 'Exito actualizando su usuario',
                    });
                }

                this._taskOdoo.setNewPassword(this.usuario.password);
                this._chatOdoo.setNewPassword(this.usuario.password);
                setTimeout(() => {
                    this.navCtrl.navigateRoot('/tabs/tab3', {
                        animated: true,
                        animationDirection: 'back',
                    });
                }, 2000);
            });
        });
    }

    ngOnDestroy() {
        this.subscriptionError.unsubscribe();
        this.subscriptionOk.unsubscribe();
    }

    iniciar() {
        if (this.cambiada == '' || this.confirmada == '') {
            this.campos_vacios = true;
            this.confirmacion_pass = true;
            //this.toast_error_contraseña();
        } else {
            this.campos_vacios = false;
            if (this.cambiada == this.confirmada) {
                // this.messageService.add({ severity: 'success', detail: 'completo' });
                //console.log('todo bien')
                this.confirmacion_pass = false;
                this.usuario.password = this.cambiada;
                this.updatePassword(this.usuario);
                this.deshabilitar = true;
                this.presentLoading();
            } else {
                this.deshabilitar = false;
                // this.messageService.add({ severity: 'error', detail: 'Contraseña incorrecta' });
                console.log('todo mal');
                //this.toast_error_contraseña();
                //this.messageService.add({ severity: 'error', summary: 'Error', detail: 'La confirmacion no es la misma' });
                this.confirmacion_pass = true;
            }
        }
    }

    async toast_error_contraseña() {
        const toast = await this.toastController.create({
            message: 'Verifique los campos ',
            duration: 2000,
        });
        toast.present();
    }

    updatePassword(usuario: UsuarioModel) {
        this._signupOdoo.updateUserPasswordInside(usuario);
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
