import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { Marcador } from 'src/app/models/marcador.class';
import { TaskModel } from 'src/app/models/task.model';
import { ObtSubSService } from 'src/app/services/obt-sub-s.service';
import { TaskOdooService } from 'src/app/services/task-odoo.service';

@Component({
    selector: 'app-map-detail',
    templateUrl: './map-detail.page.html',
    styleUrls: ['./map-detail.page.scss'],
})
export class MapDetailPage implements OnInit {
    lat: number;
    lng: number;
    task: TaskModel = new TaskModel();
    marcadores: Marcador[] = [];
    ruta: string = '';

    constructor(
        private _taskOdoo: TaskOdooService,
        private platform: Platform,
        public navCtrl: NavController,
        private datos: ObtSubSService
    ) {
        if (this.datos.getruta() !== '/task-abstract') {
            this.task = this._taskOdoo.getTaskCesar();
            this.lat = Number(this.task.address.latitude);
            this.lng = Number(this.task.address.longitude);
            const nuevoMarcador = new Marcador(this.lat, this.lng);
            this.marcadores.push(nuevoMarcador);
        } else {
            this.lat = Number(this.datos.getlatitud());
            this.lng = Number(this.datos.getlongitud());
            const nuevoMarcador = new Marcador(this.lat, this.lng);

            this.marcadores.push(nuevoMarcador);
        }
    }

    ngOnInit() {
        setTimeout(() => {
            document.getElementById('map-parent').style.width = '100%';
        }, 50);

        // this.ruta = this.datos.getruta();

        // if (this.ruta == '/ofertas') {
        //     this.datos.set_Detalles(true);
        // }

        this.platform.backButton.subscribeWithPriority(10, () => {
            // if (this.ruta == '/ofertas') {
            this.navCtrl.navigateRoot(this.datos.getruta(), {
                animated: true,
                animationDirection: 'back',
            });
            // } else if (this.ruta == '/anonimus-card') {
            //     this.navCtrl.navigateRoot(this.ruta, {
            //         animated: true,
            //         animationDirection: 'back',
            //     });
            // } else {
            //     this.navCtrl.navigateRoot('contratados', {
            //         animated: true,
            //         animationDirection: 'back',
            //     });
            // }
        });
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
    }
}
