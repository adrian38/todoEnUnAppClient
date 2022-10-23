import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { TaskModel } from 'src/app/models/task.model';
import { ObtSubSService } from 'src/app/services/obt-sub-s.service';

@Component({
    selector: 'app-task-title',
    templateUrl: './task-title.page.html',
    styleUrls: ['./task-title.page.scss'],
})
export class TaskTitlePage implements OnInit {
    titulo: string = '';
    checkSi: boolean = false;
    checkNo: boolean = true;
    validado: boolean = true;
    servicio: string = '';
    task: TaskModel;

    constructor(
        private _serv: ObtSubSService,
        public navCtrl: NavController,
        private platform: Platform,
        public alertCtrl: AlertController
    ) {}

    ngOnInit() {
        this.servicio = this._serv.getServ();

        /* this.servicio=this._serv.getServ();
		console.log(this.servicio); */
        /* this.titulo=this._serv.gettitulo(); */

        /*     this.titulo=this._serv.get_sub_servicio_activo();
			if(this.titulo==""){
			  this.validado=true;


			}
			else{
			  this.validado=false;

			} */

        this.titulo = this._serv.gettitulo();

        this.platform.backButton.subscribeWithPriority(10, () => {
            this.navCtrl.navigateRoot('/option', { animated: true, animationDirection: 'back' });
        });

        /* this.platform.backButton.subscribeWithPriority(10, () => {
		  this.navCtrl.navigateRoot('/option', {animated: true, animationDirection: 'back' }) ;

		  }); */
    }

    cerrarsolicitud() {
        this.presentAlert();
    }

    async presentAlert() {
        const alert = await this.alertCtrl.create({
            cssClass: 'my-custom-class',
            header: 'Alerta',
            message: 'Desea cancelar la solicitud',

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
                    handler: (_serv) => {
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
        this._serv.setTitulo(this.titulo);

        this.navCtrl.navigateRoot('/task-materials', {
            animated: true,
            animationDirection: 'forward',
        });
    }
}
