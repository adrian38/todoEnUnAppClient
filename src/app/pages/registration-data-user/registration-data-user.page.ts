import { Component, NgZone, OnInit } from '@angular/core';
import { PhotoService } from 'src/app/services/photo.service';
import { AlertController, LoadingController, NavController, Platform } from '@ionic/angular';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { Address } from '../../models/task.model';
import { ObtSubSService } from 'src/app/services/obt-sub-s.service';
import { Photo } from 'src/app/interfaces/interfaces';
import { ToastController } from '@ionic/angular';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

import { Observable, Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { SignUpOdooService } from 'src/app/services/signup-odoo.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-registration-data-user',
    templateUrl: './registration-data-user.page.html',
    styleUrls: ['./registration-data-user.page.scss'],
})
export class RegistrationDataUserPage implements OnInit {
    obligatorioGPS: boolean = false;

    imgResultBeforeCompress: string;
    imgResultAfterCompress: string;

    verFoto: boolean = false;
    verFotoInicial: boolean = true;

    usuario: UsuarioModel;
    address: Address;

    piso: string = '';
    puerta: string = '';
    confirmPass = '';
    nombre = '';
    date = '';
    user = '';
    password = '';
    //phone:string = "";
    phone: number;
    streetNumber = '';
    number;
    portal = '';
    avatarusuario = '../../../assets/images/registro.svg';
    avatarusuario64: string = '';

    cod_postal: string = '';
    escalera: string = '';

    selectFoto: boolean = false;

    coordenadas_puesta: boolean = false;
    esMayorEdad = true;

    fecha_nacimiento: boolean = false;
    user_vacio: boolean = false;
    password_vacio: boolean = false;
    confirmPass_vacia: boolean = false;
    phone_vacio: boolean = false;
    streetNumber_vacio: boolean = false;
    number_vacio: boolean = false;
    confirmPassBoolean: boolean = false;

    long: number;
    lat: number;

    //------------------------------------

    nombreVacio: boolean = false;

    //------------------------------------------

    notificationOK$: Observable<boolean>;
    notificationError$: Observable<boolean>;

    subscriptionError: Subscription;
    subscriptionOk: Subscription;

    islog: boolean;
    loading: HTMLIonLoadingElement = null;

    constructor(
        public _photoService: PhotoService,
        public datos: ObtSubSService,
        public navCtrl: NavController,
        public alertController: AlertController,
        private platform: Platform,
        public toastController: ToastController,
        private messageService: MessageService,
        private ngZone: NgZone,
        private _signupOdoo: SignUpOdooService,
        public loadingController: LoadingController,
        private router: Router
    ) {
        this.selectFoto = this.datos.getselectfoto();
    }

    ngOnInit() {
        defineCustomElements(window);
        this.obtener_campos();

        this.platform.backButton.subscribeWithPriority(10, () => {
            this.alert_atras();
        });

        this.notificationError$ = this._signupOdoo.getNotificationError$();
        this.subscriptionError = this.notificationError$.subscribe((notificationError) => {
            this.ngZone.run(() => {
                if (notificationError) {
                    this.loading.dismiss();
                    this.messageService.add({
                        severity: 'error',
                        detail: 'El usuario no se registro',
                    });
                    //error por usuario ya creado o conectividad o datos ingreados///////esto lo vamos a definir despues
                }
            });
        });
        this.notificationOK$ = this._signupOdoo.getNotificationOK$();
        this.subscriptionOk = this.notificationOK$.subscribe((notificationOK) => {
            this.ngZone.run(() => {
                if (notificationOK) {
                    //quitar cargado e ir a la pagina de logguearse

                    this.loading.dismiss();
                    this.messageService.add({ severity: 'success', detail: 'Usuario registrado' });

                    setTimeout(() => {
                        this.vaciar_campos();
                        this.navCtrl.navigateRoot('/login', {
                            animated: true,
                            animationDirection: 'back',
                        });
                    }, 2000);
                }
            });
        });
    }

    ngOnDestroy(): void {
        this.subscriptionOk.unsubscribe();
        this.subscriptionError.unsubscribe();
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

    iniciar() {
        this.obligatorio();

        if (
            !this.selectFoto &&
            !this.nombreVacio &&
            this.fecha_nacimiento == false &&
            this.esMayorEdad &&
            !this.user_vacio &&
            !this.password_vacio &&
            !this.confirmPass_vacia &&
            !this.confirmPassBoolean &&
            !this.phone_vacio &&
            !this.streetNumber_vacio &&
            !this.number_vacio &&
            !this.obligatorioGPS
        ) {
            console.log('creando el usuario');
            this.completarRegistro();
        } else {
            console.log('no se puede crear');
        }
    }

    ubicacion() {
        this.entrar_campos();
        this.datos.setruta(this.router.url);
        this.navCtrl.navigateRoot('/map', { animated: true, animationDirection: 'forward' });
    }

    entrar_campos() {
        this.datos.setnombre(this.nombre.trim());
        this.datos.setfecha(this.date.slice(0, 10));
        this.datos.setcorreo(this.user.trim().toLowerCase());
        this.datos.setcontraseña(this.password);
        this.datos.setcontraseñaConfirmafa(this.confirmPass);
        this.datos.settelefono(this.phone);
        this.datos.setcalle(this.streetNumber.trim());
        this.datos.setnumero(this.number);
        this.datos.setpuerta(this.puerta);
        this.datos.setportal(this.portal);
        this.datos.setcod_postal(this.cod_postal);
        this.datos.setpiso(this.piso);
        this.datos.setescalera(this.escalera);

        this.datos.setfoto0(this.avatarusuario64);
        this.datos.setfotoRegis(this.avatarusuario);

        // 		console.log('foto',this.avatarusuario64);
    }

    obtener_campos() {
        this.nombre = this.datos.getnombre().trim();
        this.user = this.datos.getcorreo().trim();
        this.password = this.datos.getcontraseña().trim();
        this.confirmPass = this.datos.getcontraseñaConfirmafa().trim();
        this.phone = this.datos.gettelefono();
        this.streetNumber = this.datos.getcalle().trim();
        this.number = this.datos.getnumero();
        this.piso = this.datos.getpiso().trim();
        this.puerta = this.datos.getpuerta().trim();
        this.portal = this.datos.getportal().trim();
        this.escalera = this.datos.getescalera().trim();
        this.date = this.datos.getfecha().trim();
        this.coordenadas_puesta = this.datos.getcoordenada();
        this.long = this.datos.getlongitud();
        this.lat = this.datos.getlatitud();
        this.avatarusuario = this.datos.getfotoRegis();
        this.avatarusuario64 = this.datos.getfoto0();
    }
    vaciar_campos() {
        this.datos.setfoto0('');
        this.datos.setfoto1('');
        this.datos.setfecha('');
        this.datos.setnombre('');
        this.datos.setcorreo('');
        this.datos.setcontraseña('');
        this.datos.setcontraseñaConfirmafa('');
        this.datos.settelefono('');
        this.datos.setcalle('');
        this.datos.setnumero(0);
        this.datos.setpiso('');
        this.datos.setpuerta('');
        this.datos.setportal('');
        this.datos.setescalera('');
        this.datos.setcod_postal('');

        this.coordenadas_puesta = false;
        this.long = null;
        this.lat = null;
    }

    async alert_atras() {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Alerta',
            message: 'Perderá todos los datos',
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                        console.log('Confirm Cancel: blah');
                    },
                },
                {
                    text: 'Aceptar',
                    handler: (datos) => {
                        this.vaciar_campos();
                        this.navCtrl.navigateRoot('/home', {
                            animated: true,
                            animationDirection: 'back',
                        });
                    },
                },
            ],
        });

        await alert.present();
    }

    obligatorio() {
        if (this.avatarusuario64 != '') {
            this.selectFoto = false;
        } else {
            this.selectFoto = true;
        }
        if (this.nombre != '') {
            this.nombreVacio = false;
        } else {
            this.nombreVacio = true;
        }

        // if (this.date != '') {
        //     this.fecha_nacimiento = false;
        // } else {
        //     this.fecha_nacimiento = true;
        // }

        if (this.user != '') {
            this.user_vacio = false;
        } else {
            this.user_vacio = true;
        }

        if (this.password != '') {
            this.password_vacio = false;
        } else {
            this.password_vacio = true;
        }

        if (this.confirmPass != '') {
            this.confirmPass_vacia = false;
        } else {
            this.confirmPass_vacia = true;
        }

        if (this.phone != null) {
            this.phone_vacio = false;
        } else {
            this.phone_vacio = true;
        }

        if (this.streetNumber != '') {
            this.streetNumber_vacio = false;
        } else {
            this.streetNumber_vacio = true;
        }

        if (this.number) {
            this.number_vacio = false;
        } else {
            this.number_vacio = true;
        }

        if (!this.coordenadas_puesta) {
            this.obligatorioGPS = true;
        } else {
            this.obligatorioGPS = false;
        }
    }
    //-----------------------------*******************----------------

    completarRegistro() {
        this.usuario = new UsuarioModel();
        this.usuario.address = new Address('', '', '', '', '', '', '', '', '', 0);

        this.usuario.realname = this.nombre.trim();
        this.usuario.password = this.password;
        this.usuario.phone = this.phone;
        this.usuario.username = this.user.trim().toLowerCase();
        this.usuario.date = this.date;

        this.usuario.type = 'client';

        this.usuario.address.street = this.streetNumber;
        this.usuario.address.door = this.puerta;
        this.usuario.address.stair = this.escalera;
        this.usuario.address.portal = this.portal;
        this.usuario.address.cp = this.cod_postal;
        this.usuario.address.number = this.number.toString();
        this.usuario.address.floor = this.piso;

        this.usuario.address.longitude = String(this.long);
        this.usuario.address.latitude = String(this.lat);

        let foto = this.avatarusuario64;

        if (Buffer.from(foto.substring(foto.indexOf(',') + 1)).length / 1e6 > 0.322216) {
            this.resizedataURL(foto, 1280, 960);
        } else {
            this.usuario.avatar = foto.substring(foto.indexOf(',') + 1);
        }

        console.log('todoantes', this.usuario);

        // this._signupOdoo.newUser(this.usuario);
        // this.presentLoading();
    }

    resizedataURL(datas, wantedWidth, wantedHeight) {
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
            this.usuario.avatar = temp.substring(temp.indexOf(',') + 1);
        };
    }
    async presentLoading() {
        this.loading = await this.loadingController.create({
            cssClass: 'my-custom-class',
            message: 'Registrando...',
            //duration: 2000
        });

        return this.loading.present();
    }

    compararContraea(cp) {
        if (cp == '') {
            this.confirmPass_vacia = true;
            this.confirmPassBoolean = false;
        } else {
            this.confirmPass_vacia = false;
            if (this.password == cp) {
                this.confirmPassBoolean = false;
                //this.confirmPass_vacia=false;
            } else {
                this.confirmPassBoolean = true;
                //this.confirmPass_vacia=false;
            }
        }
    }
}
