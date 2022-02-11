import { Component, NgZone, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController, Platform } from '@ionic/angular';
import { Photo } from 'src/app/interfaces/interfaces';
import { Address, UsuarioModel } from 'src/app/models/usuario.model';
import { ObtSubSService } from 'src/app/services/obt-sub-s.service';
import { PhotoService } from 'src/app/services/photo.service';
import { SignUpOdooService } from 'src/app/services/signup-odoo.service';
import { AuthOdooService } from 'src/app/services/auth-odoo.service';
import { MessageService } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { Router } from '@angular/router';

@Component({
    selector: 'app-user-data',
    templateUrl: './user-data.page.html',
    styleUrls: ['./user-data.page.scss'],
})
export class UserDataPage implements OnInit {
    avatarusuario: string = '';

    temp: string = '';
    usuario: UsuarioModel = new UsuarioModel();
    userToSend: UsuarioModel = new UsuarioModel();

    address: Address;

    nombre: string = '';
    fecha: string = '';
    correo: string = '';
    pass: string = '';
    calle: string = '';
    piso: string = '';
    numero: string = '';
    puerta: string = '';
    portal: string = '';
    cpostal: string = '';
    escalera: string = '';
    placeholderNombre: string = '';
    placeholderFecha: string = '';
    placeholderUser: string = '';
    placeholderCalle: string = '';
    placeholderPiso: string = '';
    placeholderNumero: string = '';
    placeholderPuerta: string = '';
    placeholderPortal: string = '';
    placeholderCp: string = '';
    placeholderEscalera: string = '';
    loading: any;

    process: boolean = false;

    avatarusuario64: string = '';

    notificationOk$: Observable<boolean>;
    notificationError$: Observable<boolean>;

    subscriptionError: Subscription;
    subscriptionOk: Subscription;

    constructor(
        public navCtrl: NavController,
        private platform: Platform,
        public datos: ObtSubSService,
        public alertController: AlertController,
        private _signupOdoo: SignUpOdooService,
        public _photoService: PhotoService,
        public _authOdoo: AuthOdooService,
        private ngZone: NgZone,
        private messageService: MessageService,
        private router: Router,
        public loadingController: LoadingController
    ) {}

    ngOnInit() {
        defineCustomElements(window);
        this.usuario = this._authOdoo.getUser();

        console.log(this.usuario);

        this.placeholder();

        this.obtener_campos();

        this.platform.backButton.subscribeWithPriority(10, () => {
            this.navCtrl.navigateRoot('/tabs/tab3', { animated: true, animationDirection: 'back' });
        });

        this.notificationError$ = this._signupOdoo.getNotificationError$();
        this.subscriptionError = this.notificationError$.subscribe((notificationError) => {
            this.ngZone.run(() => {
                if (notificationError) {
                    this.process = false;
                    if (this.loading) {
                        this.loading.dismiss();
                    }
                    //this.presentToast("Error generando su link, vuelva a intentarlo");
                    this.messageService.add({
                        severity: 'error',
                        detail: 'Error actualizando su usuario',
                    });
                }
            });
        });

        this.notificationOk$ = this._signupOdoo.getNotificationOK$();
        this.subscriptionOk = this.notificationOk$.subscribe((notificationOk) => {
            this.ngZone.run(() => {
                this.process = false;

                if (this.loading) {
                    this.loading.dismiss();
                }
                if (notificationOk) {
                    this.messageService.add({
                        severity: 'success',
                        detail: 'Exito actualizando su usuario',
                    });
                }
            });
        });
    }

    ngOnDestroy() {
        this.subscriptionError.unsubscribe();
        this.subscriptionOk.unsubscribe();
    }

    editar() {
        if (this.calle == '') {
            this.usuario.address.street = this.usuario.address.street;
        } else {
            this.usuario.address.street = this.calle;
        }

        if (this.piso == '') {
            this.usuario.address.floor = this.usuario.address.floor;
        } else {
            this.usuario.address.floor = this.piso;
        }

        if (this.numero == '') {
            this.usuario.address.number = this.usuario.address.number;
        } else {
            this.usuario.address.number = this.numero;
        }

        if (this.puerta == '') {
            this.usuario.address.door = this.usuario.address.door;
        } else {
            this.usuario.address.door = this.puerta;
        }

        if (this.portal == '') {
            this.usuario.address.portal = this.usuario.address.portal;
        } else {
            this.usuario.address.portal = this.portal;
        }

        if (this.cpostal == '') {
            this.usuario.address.cp = this.usuario.address.cp;
        } else {
            this.usuario.address.cp = this.cpostal;
        }

        if (this.escalera == '') {
            this.usuario.address.stair = this.usuario.address.stair;
        } else {
            this.usuario.address.stair = this.escalera;
        }

        if (this.datos.getlatitud() != 0) {
            this.usuario.address.latitude = String(this.datos.getlatitud());
        }
        if (this.datos.getlongitud() != 0) {
            this.usuario.address.longitude = String(this.datos.getlongitud());
        }

        // console.log('************* foto *************');
        // console.log(this.avatarusuario);

        if (this.avatarusuario != '') {
            this.usuario.avatar = this.avatarusuario;
        }

        this.userToSend = { ...this.usuario };

        if (
            Buffer.from(this.userToSend.avatar.substring(this.userToSend.avatar.indexOf(',') + 1))
                .length /
                1e6 >
            0.322216
        ) {
            this.resizedataURL(this.userToSend.avatar, 1280, 960);
        } else {
            this.userToSend.avatar = this.userToSend.avatar.substring(
                this.userToSend.avatar.indexOf(',') + 1
            );
            this.process = true;
            this.presentLoadingCargado();
            this._signupOdoo.updateUser(this.userToSend);
        }

        // console.log(this.userToSend.avatar, 'listo para el servicio');
    }

    async presentAlertConfirm() {
        try {
            let temp = await this._photoService.addNewToCamera();
            this.avatarusuario64 = temp;
            this.avatarusuario = temp;
            return 'ok';
        } catch (err) {
            console.log('no photo');
        }
    }

    ubicacion() {
        this.entrar_campos();
        this.datos.setruta(this.router.url);
        this.navCtrl.navigateRoot('/map', { animated: true, animationDirection: 'forward' });
    }

    entrar_campos() {
        this.datos.setcalle(this.calle);
        this.datos.setpiso(this.piso);
        this.datos.setnumero(parseInt(this.numero));
        this.datos.setpuerta(this.puerta);
        this.datos.setportal(this.portal);
        this.datos.setescalera(this.escalera);
        this.datos.setcod_postal(this.cpostal);
        this.datos.setfoto0(this.avatarusuario64);
    }

    obtener_campos() {
        this.calle = this.datos.getcalle();
        if (this.datos.getnumero()) {
            this.numero = this.datos.getnumero().toString();
        }
        this.piso = this.datos.getpiso();
        this.puerta = this.datos.getpuerta();
        this.portal = this.datos.getportal();
        this.escalera = this.datos.getescalera();
        this.cpostal = this.datos.getcod_postal();
        if (this.datos.getfoto0() != '') {
            this.avatarusuario64 = this.datos.getfoto0();
            this.avatarusuario = this.datos.getfoto0();
        }
    }

    placeholder() {
        /* console.log("nuevo",this.usuario.address.stair.length);
	console.log("nuevo",this.usuario.address.cp); */

        if (this.usuario.avatar.length == 0) {
            this.avatarusuario = '../../../assets/images/registro.svg';
        } else {
            this.avatarusuario = this.usuario.avatar;
        }

        if (this.usuario.address.street == '') {
            this.placeholderCalle = 'Calle';
            console.log('sin calle', this.calle);
        } else {
            this.placeholderCalle = this.usuario.address.street;
            console.log('calle', this.placeholderCalle);
        }

        if (this.usuario.address.floor.length == 0) {
            this.placeholderPiso = 'Piso';
        } else {
            this.placeholderPiso = this.usuario.address.floor;
        }

        if (this.usuario.address.number.length == 0) {
            this.placeholderNumero = 'Numero';
        } else {
            this.placeholderNumero = this.usuario.address.number;
        }

        if (this.usuario.address.door.length == 0) {
            this.placeholderPuerta = 'Puerta';
        } else {
            this.placeholderPuerta = this.usuario.address.door;
        }

        if (this.usuario.address.portal.length == 0) {
            this.placeholderPortal = 'Portal';
        } else {
            this.placeholderPortal = this.usuario.address.portal;
        }

        if (this.usuario.address.cp.length == 0) {
            this.placeholderCp = 'C_Postal';
        } else {
            this.placeholderCp = this.usuario.address.cp;
        }

        if (this.usuario.address.stair.length == 0) {
            this.placeholderEscalera = 'Escalera';
        } else {
            this.placeholderEscalera = this.usuario.address.stair;
        }
    }

    async resizedataURL(datas, wantedWidth, wantedHeight) {
        //console.log(datas, 'como llega al resize');

        var img = document.createElement('img');
        img.src = datas;
        img.onload = () => {
            let ratio = img.width / img.height;
            wantedWidth = wantedHeight * ratio;
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');
            canvas.width = wantedWidth;
            canvas.height = wantedHeight;
            ctx.drawImage(img, 0, 0, wantedWidth, wantedHeight);
            let temp = canvas.toDataURL('image/jpeg', [0.0, 1.0]);

            this.userToSend.avatar = temp.substring(temp.indexOf(',') + 1);
            this.process = true;
            this.presentLoadingCargado();
            this._signupOdoo.updateUser(this.userToSend);
        };
    }

    async presentLoadingCargado() {
        this.loading = await this.loadingController.create({
            cssClass: 'my-custom-class',
            message: 'Actualizando datos...',
            //duration: 2000
        });
        return this.loading.present();
    }
}
