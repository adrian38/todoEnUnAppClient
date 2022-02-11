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
    number = '';
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
        public loadingController: LoadingController
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
                        this.navCtrl.navigateRoot('/inicio', {
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
            // const alert = await this.alertController.create({
            // 	cssClass: 'my-custom-class',
            // 	header: '¿Desea colocar una foto?',
            // 	message: 'Selecione la opcion de camara o galeria para la foto ',
            // 	buttons: [
            // 		{
            // 			text: 'Camara',
            // 			handler: async () => {
            // 				let photo: Photo = await this.photoService.addNewToCamara();
            // 				if (photo) {
            // 					this.avatarusuario = photo.webviewPath;
            // 					// console.log('this.avatarusuario', this.avatarusuario);
            // 					this.avatarusuario64 = this.photoService.devuelve64().slice(22);
            // 					//console.log('this.avatarusuario64', this.avatarusuario64);
            // 					this.selectFoto = true;
            // 					this.datos.setselectfoto(true);
            // 					// console.log('this.avatarusuario64puroinicio',this.avatarusuario64.slice(0,22));
            // 					// console.log('this.avatarusuario64purofin',this.avatarusuario64.slice(22));
            // 				}
            // 			}
            // 		},
            // 		{
            // 			text: 'Galeria',
            // 			handler: async () => {
            // 				this.photoService.photos = [];
            // 				let photos: Photo[] = await this.photoService.addNewToGallery();
            // 				if (photos.length == 1) {
            // 					this.avatarusuario = photos[0].webviewPath;
            // 					//this.avatarusuario64 = this.photoService.devuelve64();
            // 					this.avatarusuario64 = this.photoService.devuelve64().slice(22);
            // 					console.log('this.avatarusuario64', this.avatarusuario64);
            // 					this.selectFoto = true;
            // 					this.datos.setselectfoto(true);
            // 				}
            // 			}
            // 		},
            // 		{
            // 			text: 'Cancelar',
            // 			role: 'cancel',
            // 			cssClass: 'secondary',
            // 			handler: (blah) => {
            // 				this.avatarusuario = '../../../assets/registro.svg';
            // 				this.avatarusuario64 = '';
            // 				this.selectFoto = false;
            // 			}
            // 		}
            // 	]
            // });
            //	await alert.present();

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
        this.datos.setruta('registration-data-user');
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
        this.number = this.datos.getnumero().trim();
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
        this.datos.setnumero('');
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
                        this.navCtrl.navigateRoot('/inicio', {
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

        if (this.number != '') {
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
        this.usuario.address.number = this.number;
        this.usuario.address.floor = this.piso;

        this.usuario.address.longitude = String(this.long);
        this.usuario.address.latitude = String(this.lat);

        let foto = this.avatarusuario64;

        if (Buffer.from(foto.substring(foto.indexOf(',') + 1)).length / 1e6 > 0.322216) {
            this.resizedataURL(foto, 1280, 960);
        } else {
            this.usuario.avatar = foto.substring(foto.indexOf(',') + 1);
        }
        this.usuario.avatar = foto;

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

    // validarMayorDeEdad(date: string) {
    //     // Ver si se puede mejorar este algoritmo

    //     const inputDate = new Date(date);
    //     const currentDate = new Date(Date.now());

    //     const bYears = inputDate.getFullYear();
    //     const timeYears = currentDate.getFullYear();

    //     const difYears = timeYears - bYears;

    //     // Cantidad de meses entre las 2 fechas
    //     const months = difYears * 12 + (currentDate.getMonth() - inputDate.getMonth());

    //     // 18 años son 12 meses por 18 asi que son 216 meses
    //     // si la diferencia de meses entre las 2 fechas es mayor que 216 meses entonces
    //     // la persona es mayor de 18 años.
    //     // Este algoritmo no toma en cuenta los dias que quedan en el mismo mes, asi que si cumple 18
    //     // en el mismo mes en curso pero no los ha cumplido todavia, se toma en consideración.

    //     if (months >= 216) {
    //         //console.log("Es mayor de edad");
    //         this.esMayorEdad = true;
    //     } else {
    //         //console.log("No es mayor de edad");
    //         this.esMayorEdad = false;
    //     }
    // }

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

// async ToastFoto() {
// 	const toast = await this.toastController.create({
// 		message: 'Ingrese una foto',
// 		duration: 2000
// 	});
// 	toast.present();
// }

// async ToastCampos() {
// 	const toast = await this.toastController.create({
// 		message: 'Introduzca todos los campos',
// 		duration: 2000
// 	});
// 	toast.present();
// }

// async ToastCoordenadas() {
// 	const toast = await this.toastController.create({
// 		message: 'Indique su geolocalización',
// 		duration: 2000
// 	});
// 	toast.present();
// }
