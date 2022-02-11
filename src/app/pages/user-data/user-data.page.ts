import { Component, NgZone, OnInit } from '@angular/core';
import { AlertController, NavController, Platform } from '@ionic/angular';
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
    usuario: UsuarioModel;

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
        private router: Router
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
                    //this.loading.dismiss();
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
                //this._sigupOdoo.notificationPull();

                //this.loading.dismiss();
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
        this.usuario = new UsuarioModel();
        this.usuario.address = new Address('', '', '', '', '', '', '', '', '');
        this.usuario.realname = this.nombre;
        this.usuario.date = this.fecha;
        this.usuario.password = this.pass;

        this.usuario.username = this.correo;

        this.usuario.type = 'client';

        this.usuario.address.street = this.calle;
        this.usuario.address.door = this.puerta;
        this.usuario.address.stair = this.escalera;
        this.usuario.address.portal = this.portal;
        this.usuario.address.cp = this.cpostal;
        this.usuario.address.number = this.numero;
        this.usuario.address.floor = this.piso;
        this.usuario.avatar = this.avatarusuario64;

        this.usuario.address.latitude = String(this.datos.getlatitud());
        this.usuario.address.longitude = String(this.datos.getlongitud());

        console.log(this.usuario, 'nuevo usuario');
        this.datos.setcoordenada(false);

        this._signupOdoo.updateUser(this.usuario);
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
        this.datos.setnombre(this.nombre);
        /* console.log("registronombre",this.nombre); */
        this.datos.setcorreo(this.correo);
        this.datos.setcontraseña(this.pass);

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
        this.nombre = this.datos.getnombre();
        this.correo = this.datos.getcorreo();
        this.pass = this.datos.getcontraseña();

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

    updatePersonalInfo(usuario: UsuarioModel) {
        this._signupOdoo.updateUser(usuario);
    }
}
