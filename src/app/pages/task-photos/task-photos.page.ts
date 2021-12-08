import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, NavController, Platform } from '@ionic/angular';
import { ObtSubSService } from 'src/app/services/obt-sub-s.service';
import { PhotoService } from 'src/app/services/photo.service';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
// import { Photo } from 'src/app/interfaces/interfaces';

@Component({
    selector: 'app-task-photos',
    templateUrl: './task-photos.page.html',
    styleUrls: ['./task-photos.page.scss'],
})
export class TaskPhotosPage implements OnInit {
    foto0: string = '';
    foto1: string = '';
    foto2: string = '';
    foto064: string = '';
    foto164: string = '';
    foto264: string = '';

    servicio: string = '';

    constructor(
        private _serv: ObtSubSService,
        public navCtrl: NavController,
        public _photoService: PhotoService,
        public actionSheetController: ActionSheetController,
        public alertController: AlertController,
        public platform: Platform
    ) {
        this.servicio = this._serv.getServ();
    }

    ngOnInit() {
        defineCustomElements(window);
        this.foto0 = this._serv.getfoto00();
        this.foto1 = this._serv.getfoto11();
        this.foto2 = this._serv.getfoto22();
        this.subscriptions();
    }
    cerrarsolicitud() {
        this.showAlert();
    }

    subscriptions() {
        this.platform.backButton.subscribeWithPriority(10, () => {
            this.navCtrl.navigateRoot('/task-materials', {
                animated: true,
                animationDirection: 'back',
            });
        });
    }

    goto() {
        this.navCtrl.navigateRoot('/task-description', {
            animated: true,
            animationDirection: 'forward',
        });
    }

    // public async showActionSheet(photo: Photo, position: number) {
    //     const actionSheet = await this.actionSheetController.create({
    //         header: 'Photos',
    //         buttons: [
    //             {
    //                 text: 'Delete',
    //                 role: 'destructive',
    //                 icon: 'trash',
    //                 handler: () => {
    //                     // this.photoService.deletePicture(photo, position);
    //                 },
    //             },
    //             {
    //                 text: 'Cancel',
    //                 icon: 'close',
    //                 role: 'cancel',
    //                 handler: () => {
    //                     // Nothing to do, action sheet is automatically closed
    //                 },
    //             },
    //         ],
    //     });
    //     await actionSheet.present();
    // }

    async takePhoto(posc: number) {
        // const alert = await this.alertController.create({
        //     cssClass: 'my-custom-class',
        //     header: '¿Desea añadir una foto?',
        //     message: 'Selecione la opción de cámara o galería para la foto ',
        //     buttons: [
        //         {
        //             text: 'Cámara',
        //             handler: async () => {
        //this.photoService.photos = [];
        //let photos: Photo[];
        let temp = await this._photoService.addNewToCamera();
        // console.log(temp);
        //console.log('Fotos', JSON.stringify(this.photoService.photos));

        if (posc == 0) {
            this.foto0 = temp;
            this._serv.setfoto00(this.foto0);
            //this.foto064 = this.photoService.devuelve64();
            //this._serv.setfoto0(this.foto064);
        }
        if (posc == 1) {
            this.foto1 = temp;
            this._serv.setfoto11(this.foto1);
            //this.foto164 = this.photoService.devuelve64();
            //this._serv.setfoto1(this.foto164);
        }
        if (posc == 2) {
            this.foto2 = temp;
            this._serv.setfoto22(this.foto2);
            //this.foto264 = this.photoService.devuelve64();
            //this._serv.setfoto2(this.foto264);
        }
        //  },

        //             // if (photos.length > 1) {
        //             //     this.foto0 = photos[2].webviewPath;
        //             //     this.foto1 = photos[1].webviewPath;
        //             //     this.foto2 = photos[0].webviewPath; //la primera del arreglo es la ultima seleccionada
        //             // }
        //         },
        //         {
        //             text: 'Galería',
        //             handler: async () => {
        //                 //this.photoService.photos = [];
        //                 //let photos: Photo[];
        //                 await this._photoService.addNewToGallery();
        //                 //console.log(temp);
        //                 //console.log('Fotos', JSON.stringify(this.photoService.photos));

        //                 if (posc == 0) {
        //                     //this.foto0 = temp;
        //                     this.datos.setfoto00(this.foto0);
        //                     //this.foto064 = this.photoService.devuelve64();
        //                     this.datos.setfoto0(this.foto064);
        //                 }
        //                 if (posc == 1) {
        //                     //this.foto1 = temp;
        //                     this.datos.setfoto11(this.foto1);
        //                     //this.foto164 = this.photoService.devuelve64();
        //                     this.datos.setfoto1(this.foto164);
        //                 }
        //                 if (posc == 2) {
        //                     // this.foto2 = temp;
        //                     this.datos.setfoto22(this.foto2);
        //                     //this.foto264 = this.photoService.devuelve64();
        //                     this.datos.setfoto2(this.foto264);
        //                 }

        //                 // if (photos.length > 1) {
        //                 //     this.foto0 = photos[2].webviewPath;
        //                 //     this.foto1 = photos[1].webviewPath;
        //                 //     this.foto2 = photos[0].webviewPath; //la primera del arreglo es la ultima seleccionada
        //                 // }
        //             },
        //         },
        //         {
        //             text: 'Cancelar',
        //             role: 'cancel',
        //             cssClass: 'secondary',
        //             handler: () => {
        //                 if (posc == 0) {
        //                     this.foto0 = '/assets/images/fotoadd.png';
        //                 }
        //                 if (posc == 1) {
        //                     this.foto1 = '/assets/images/fotoadd.png';
        //                 }
        //                 if (posc == 2) {
        //                     this.foto2 = '/assets/images/fotoadd.png';
        //                 }
        //             },
        //         },
        //     ],
        // });
        // await alert.present();
    }

    async showAlert() {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Alerta',
            message: 'Desea cancelar la solicitud',

            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {},
                },
                {
                    text: 'Aceptar',
                    handler: (datos) => {
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

    // borrar_campos() {
    //     this.datos.setTitulo('');

    //     this.datos.setcalle('');
    //     this.datos.setpuerta('');
    //     this.datos.setpiso('');
    //     this.datos.setescalera('');
    //     this.datos.setcod_postal('');
    //     this.datos.setnumero('');
    //     this.datos.setportal('');
    //     this.datos.setradiobuton(false);

    //     this.datos.setcomentario('');
    //     this.datos.setfoto00('/assets/images/fotoadd.png');
    //     this.datos.setfoto11('assets/images/fotoadd.png');
    //     this.datos.setfoto22('/assets/images/fotoadd.png');

    //     this.datos.setfoto0('');
    //     this.datos.setfoto1('');
    //     this.datos.setfoto2('');
    // }
}
