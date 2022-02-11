import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController, Platform, ToastController } from '@ionic/angular';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthOdooService } from 'src/app/services/auth-odoo.service';
import { ObtSubSService } from 'src/app/services/obt-sub-s.service';

@Component({
    selector: 'app-task-location',
    templateUrl: './task-location.page.html',
    styleUrls: ['./task-location.page.scss'],
})
export class TaskLocationPage implements OnInit {
    calle: string = '';
    piso: string = '';
    numero: string = '';
    puerta: string = '';
    portal: string = '';
    cod_postal: string = '';
    escalera: string = '';
    longitud: string = '';
    latitud: string = '';
    servicio: string = '';

    dpcalle: string;
    dppiso: string = '';
    dpnumero: string = '';
    dppuerta: string = '';
    dpportal: string = '';
    dpcod_postal: string = '';
    dpescalera: string = '';
    dpservicio: string = '';

    coordenadas: boolean;
    oblidatoriocalle: boolean = false;
    oblidatorionumero: boolean = false;
    oblidatorioGPS: boolean = false;

    Autofill: boolean;

    user: UsuarioModel;

    constructor(
        private _serv: ObtSubSService,
        public navCtrl: NavController,
        private platform: Platform,
        private _authOdoo: AuthOdooService,
        public alertCtrl: AlertController,

        public toastController: ToastController,
        private router: Router
    ) {
        this.coordenadas = this._serv.getcoordenada();
        this.servicio = this._serv.getServ();
        this.user = this._authOdoo.getUser();

        this.mantener_campos(1);
    }

    ngOnInit() {
        this.subscriptions();
    }

    subscriptions() {
        this.platform.backButton.subscribeWithPriority(10, () => {
            this.navCtrl.navigateRoot('/task-description', {
                animated: true,
                animationDirection: 'back',
            });
        });
    }

    cerrarsolicitud() {
        this.showAlert();
    }

    async showAlert() {
        const alert = await this.alertCtrl.create({
            cssClass: 'my-custom-class',
            header: 'Alerta',
            message: 'Desea cancelar la solicitud',

            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {},
                },
                {
                    text: 'Aceptar',
                    handler: () => {
                        this._serv.deleteFields();
                        this.navCtrl.navigateRoot('/tabs/tab1', {
                            animated: true,
                            animationDirection: 'forward',
                        });
                    },
                },
            ],
        });

        await alert.present();
    }

    goto() {
        this.mantener_campos(0);
        if (this.calle == '') {
            this.oblidatoriocalle = true;
        } else {
            this.oblidatoriocalle = false;
        }

        if (this.numero == '') {
            this.oblidatorionumero = true;
        } else {
            this.oblidatorionumero = false;
        }

        if (this.coordenadas == false) {
            this.oblidatorioGPS = true;
        } else {
            this.oblidatorioGPS = false;
        }

        if (
            this.oblidatoriocalle == false &&
            this.oblidatorionumero == false &&
            this.oblidatorioGPS == false
        ) {
            this.navCtrl.navigateRoot('/task-abstract', {
                animated: true,
                animationDirection: 'forward',
            });

            /* 	console.log('oblidatoriocalle',this.oblidatoriocalle);
		console.log('oblidatorionumero',this.oblidatorionumero);
		console.log('oblidatorioGPS',this.oblidatorioGPS); */
        } else {
            //console.log('llene campo');
            this.ToastCoordenadas();
            /*
			  console.log('oblidatoriocalle',this.oblidatoriocalle);
		      console.log('oblidatorionumero',this.oblidatorionumero);
		      console.log('oblidatorioGPS',this.oblidatorioGPS); */
        }
    }

    autofillChange() {
        /* 	console.log('usuario',this.user.address);
		console.log('oblidatoriocalle',this.oblidatoriocalle);
		console.log('oblidatorionumero',this.oblidatorionumero);
		console.log('oblidatorioGPS',this.oblidatorioGPS); */

        if (this.Autofill) {
            for (let value in this.user.address) {
                if (!this.user.address[value]) this.user.address[value] = '';
            }

            this.calle = this.user.address.street;
            this.puerta = this.user.address.door;
            this.cod_postal = this.user.address.cp;
            this.escalera = this.user.address.stair;
            this.piso = this.user.address.floor;
            this.numero = this.user.address.number;
            this.portal = this.user.address.portal;
            this.latitud = this.user.address.latitude;
            this.longitud = this.user.address.longitude;
            //this.oblidatorioGPS=true;
            this.coordenadas = true;
            console.log('oblidatorioGPS', this.oblidatorioGPS);
        } else {
            this.calle = '';
            this.puerta = '';
            this.cod_postal = '';
            this.escalera = '';
            this.piso = '';
            this.numero = '';
            this.portal = '';
            this.latitud = '';
            this.longitud = '';
            this.coordenadas = false;
        }
    }

    ubicacion() {
        this.mantener_campos_manual();
        this._serv.setruta(this.router.url);
        //this._serv.setMapType(true);
        this.navCtrl.navigateRoot('/map', { animated: true, animationDirection: 'back' });
    }

    mantener_campos_manual() {
        this._serv.setcalle(this.calle);
        this._serv.setpuerta(this.puerta);
        this._serv.setpiso(this.piso);
        this._serv.setescalera(this.escalera);
        this._serv.setcod_postal(this.cod_postal);
        this._serv.setnumero(parseInt(this.numero));
        this._serv.setportal(this.portal);
        this._serv.setradiobuton(false);
    }
    mantener_campos(i: number) {
        if (i == 0) {
            this._serv.setcalle(this.calle);
            this._serv.setpuerta(this.puerta);
            this._serv.setpiso(this.piso);
            this._serv.setescalera(this.escalera);
            this._serv.setcod_postal(this.cod_postal);
            this._serv.setnumero(parseInt(this.numero));
            this._serv.setportal(this.portal);
            this._serv.setLatitud(parseFloat(this.latitud));
            this._serv.setLongitud(parseFloat(this.longitud));
            this._serv.setradiobuton(this.Autofill);
        } else {
            this.calle = this._serv.getcalle();
            this.puerta = this._serv.getpuerta();
            this.piso = this._serv.getpiso();
            this.escalera = this._serv.getescalera();
            this.cod_postal = this._serv.getcod_postal();
            if (this._serv.getnumero()) {
                this.numero = this._serv.getnumero().toString();
            }
            this.portal = this._serv.getportal();
            this.latitud = String(this._serv.getlatitud());
            this.longitud = String(this._serv.getlongitud());
            this.Autofill = this._serv.getradiobuton();
            console.log('marca', this.Autofill);
        }
    }

    async ToastCoordenadas() {
        const toast = await this.toastController.create({
            message: 'Indique su geolocalización',
            duration: 2000,
        });
        toast.present();
    }
}
