import { Component, NgZone, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Marcador } from 'src/app/models/marcador.class';
import { ObtSubSService } from 'src/app/services/obt-sub-s.service';
import { NavController, Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { LocationService } from 'src/app/services/location.service';
import { MapsAPILoader } from '@agm/core';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { Geolocation } from '@capacitor/geolocation';
import { TaskOdooService } from 'src/app/services/task-odoo.service';
import { TaskModel } from 'src/app/models/task.model';

@Component({
    selector: 'app-map',
    templateUrl: './map.page.html',
    styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
    marcadores: Marcador[] = [];
    lat = 19.29095;
    lng = -99.653015;
    coordenadas: boolean = false;
    ruta: string = '';
    watchId: any;
    numero: string = '';
    calle: string = '';
    localizar: boolean = false;
    zoom = 2;
    directions = '';
    geocoder = new google.maps.Geocoder();

    options: Options = {
        origin: new google.maps.LatLng(43.2633182, -2.9349041608216098),
        types: [],
        componentRestrictions: { country: 'ES' },
        fields: ['place_id', 'geometry', 'name'],
        bounds: new google.maps.LatLngBounds(
            new google.maps.LatLng(19.43488390019791, -164.271592),
            new google.maps.LatLng(51.943852774877634, -79.896592)
        ),
        strictBounds: false,
    };

    //mapType: boolean = false;
    // task: TaskModel;

    constructor(
        private _taskOdoo: TaskOdooService,
        private Serv: ObtSubSService,
        public toastController: ToastController,
        private platform: Platform,
        public navCtrl: NavController,
        private datos: ObtSubSService,
        private mapsAPILoader: MapsAPILoader,
        public ngZone: NgZone,
        private locationService: LocationService
    ) {
        this.calle = this.datos.getcalle().trim();

        if (this.calle) {
            this.numero = this.datos.getnumero().toString();
            this.getLocaleDirection();
        } else {
            this.getMyLocation(false);
        }
    }
    ngOnInit() {
        setTimeout(() => {
            document.getElementById('map-parent').style.width = '100%';
        }, 50);

        //this.ruta = this.datos.getruta();

        /* 		this.platform.backButton.subscribeWithPriority(10, () => {
			if (this.ruta == 'datospersonales') {
				this.navCtrl.navigateRoot('/datospersonales', { animated: true, animationDirection: 'back' });
			} else {
				this.navCtrl.navigateRoot('/registro', { animated: true, animationDirection: 'back' });
			}
		}); */

        this.platform.backButton.subscribeWithPriority(10, () => {
            console.log('backbutton', this.datos.getruta());
            this.navCtrl.navigateRoot(this.datos.getruta(), {
                animated: true,
                animationDirection: 'back',
            });
        });
    }

    public async handleAddressChange(address: Address) {
        try {
            if (address && address.geometry) {
                const lat = address.geometry.location.lat(); //lat drop
                const lng = address.geometry.location.lng();

                //console.log(address.name)
                this.Serv.setCity(address.name);
                this.lat = lat;
                this.lng = lng;
                this.marcadores = [];
                this.Serv.setLatitud(this.lat);
                this.Serv.setLongitud(this.lng);

                const nuevoMarcador = new Marcador(this.lat, this.lng);
                this.marcadores.push(nuevoMarcador);
                this.presentToast();
                this.Serv.setcoordenada(true);
            }
        } catch (err) {
            const toast = await this.toastController.create({
                message: 'Error buscando localización',
                duration: 1000,
            });
            toast.present();
        }
    }

    codeLatLng(lat, lng) {
        let latlng = new google.maps.LatLng(lat, lng);
        this.geocoder.geocode({ location: latlng }, (results, status) => {
            if (status == google.maps.GeocoderStatus.OK) {
                //console.log(results);
                if (results[0]) {
                    //formatted address
                    console.log(results[0]);
                    this.datos.setCity(
                        results[0].address_components.filter(
                            (ac) => ~ac.types.indexOf('locality')
                        )[0].long_name
                    );
                } else {
                    console.log('No results found');
                }
            } else {
                console.log('Geocoder failed due to: ' + status);
            }
        });
    }

    getLocaleDirection() {
        this.mapsAPILoader.load().then(() => {
            const geocoder = new google.maps.Geocoder();
            const address = 'España' + ' ' + this.calle + ' ' + this.numero;
            geocoder.geocode({ address: address }, (results, status) => {
                if (status === 'OK') {
                    this.lat = results[0].geometry.location.lat();
                    this.lng = results[0].geometry.location.lng();
                    this.zoom = 18;
                } else {
                    console.log('error');
                    alert('Geocode was not successful for the following reason: ' + status);
                }
            });
        });
    }

    agregarMarcador(evento) {
        //console.log(evento, 'cuando pongo el marcador');
        this.marcadores = [];
        this.Serv.setLatitud(evento.coords.lat);
        this.Serv.setLongitud(evento.coords.lng);
        const coords: { lat: number; lng: number } = evento.coords;
        const nuevoMarcador = new Marcador(coords.lat, coords.lng);
        this.marcadores.push(nuevoMarcador);
        this.codeLatLng(coords.lat, coords.lng);
        this.presentToast();
        this.Serv.setcoordenada(true);
    }

    async presentToast() {
        const toast = await this.toastController.create({
            message: 'Marcador agregado',
            duration: 1000,
        });
        toast.present();
    }

    async getMyLocation(marker: Boolean) {
        if (marker) {
            this.localizar = true;
        }

        const hasPermission = await this.locationService.checkGPSPermission();
        if (hasPermission) {
            if (Capacitor.isNativePlatform()) {
                const canUseGPS = await this.locationService.askToTurnOnGPS();
                this.postGPSPermission(canUseGPS);
            } else {
                this.postGPSPermission(true);
            }
        } else {
            const permission = await this.locationService.requestGPSPermission();
            if (permission === 'CAN_REQUEST' || permission === 'GOT_PERMISSION') {
                if (Capacitor.isNativePlatform()) {
                    const canUseGPS = await this.locationService.askToTurnOnGPS();
                    this.postGPSPermission(canUseGPS);
                } else {
                    this.postGPSPermission(true);
                }
            } else {
                const toast = await this.toastController.create({
                    message: 'El usuario no ha dado permiso parta usar la geolocalizacion',
                    duration: 2000,
                });

                toast.present();
            }
        }
    }

    async postGPSPermission(canUseGPS: boolean) {
        if (canUseGPS) {
            this.watchPosition();
        } else {
            const toast = await this.toastController.create({
                message: 'Por favor prenda el GPS de su telefono',
                duration: 2000,
            });

            toast.present();
        }
    }

    async watchPosition() {
        try {
            this.watchId = Geolocation.watchPosition({}, (position, err) => {
                this.ngZone.run(() => {
                    if (err) {
                        console.log('err', err);
                        return;
                    }
                    this.lat = position.coords.latitude;
                    this.lng = position.coords.longitude;
                    this.zoom = 18;

                    if (this.localizar) {
                        this.marcadores = [];
                        this.Serv.setLatitud(this.lat);
                        this.Serv.setLongitud(this.lng);

                        const nuevoMarcador = new Marcador(this.lat, this.lng);
                        this.marcadores.push(nuevoMarcador);
                        this.presentToast();
                        this.Serv.setcoordenada(true);
                    }

                    this.clearWatch();
                });
            });
        } catch (err) {
            console.log('err', err);
        }
    }

    getBack() {
        console.log('getBack', this.datos.getruta());
        if (this.marcadores.length > 0) {
            this.navCtrl.navigateRoot(this.datos.getruta(), {
                animated: true,
                animationDirection: 'forward',
            });
        } else {
            this.showAlert('Por favor geolocalize su tarea');
        }
    }

    async showAlert(message: string) {
        const toast = await this.toastController.create({
            message: message,
            duration: 2000,
        });

        toast.present();
    }

    clearWatch() {
        if (this.watchId != null) {
            Geolocation.clearWatch({ id: this.watchId });
        }
    }
}
