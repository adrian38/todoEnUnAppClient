import { Component, NgZone, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ImagenmodalPage } from '../imagenmodal/imagenmodal.page';
import {
    AlertController,
    IonContent,
    IonSegment,
    LoadingController,
    ModalController,
    NavController,
    Platform,
} from '@ionic/angular';
import { TaskModel } from 'src/app/models/task.model';
import { TaskOdooService } from 'src/app/services/task-odoo.service';
import { ObtSubSService } from 'src/app/services/obt-sub-s.service';
import { MessageModel } from 'src/app/models/message.model';
import { ChatOdooService } from 'src/app/services/chat-odoo.service';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthOdooService } from 'src/app/services/auth-odoo.service';
import { Observable, Subscription } from 'rxjs';
import { PhotoService } from 'src/app/services/photo.service';
import { Photo } from 'src/app/Interfaces/interfaces';

import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-task-complaint',
    templateUrl: './task-complaint.page.html',
    styleUrls: ['./task-complaint.page.scss'],
})
export class TaskComplaintPage implements OnInit {
    task: TaskModel;
    comentario_evidencia: string = '';

    habilitar_0: boolean = true;
    habilitar_1: boolean = true;
    habilitar_2: boolean = true;
    imagen_0 = '../../../assets/images/noImage.svg ';
    imagen_1 = '../../../assets/images/noImage.svg ';
    imagen_2 = '../../../assets/images/noImage.svg ';

    foto1: string = '../../../assets/images/fotoadd.png';
    foto2: string = '../../../assets/images/fotoadd.png';
    foto3: string = '../../../assets/images/fotoadd.png';
    foto164: string = '../../../assets/images/fotoadd.png';
    foto264: string = '../../../assets/images/fotoadd.png';
    foto364: string = '../../../assets/images/fotoadd.png';

    constructor(
        private _taskOdoo: TaskOdooService,
        private navCtrl: NavController,
        private datos: ObtSubSService,
        private modalCtrl: ModalController,
        private platform: Platform,
        private _chatOdoo: ChatOdooService,
        private _authOdoo: AuthOdooService,
        private ngZone: NgZone,
        public loadingController: LoadingController,
        private alertCtrl: AlertController,
        public photoService: PhotoService,
        private messageService: MessageService //private screenOrientation: ScreenOrientation
    ) {
        this.task = this._taskOdoo.getTaskCesar();
    }

    ngOnInit() {
        console.log('nuevooooooo', this.task);

        this.platform.backButton.subscribeWithPriority(10, () => {
            this.navCtrl.navigateRoot('/task-hired', {
                animated: true,
                animationDirection: 'back',
            });
        });
    }

    onclickFoto1(posicion) {
        this.presentAlert(posicion);
    }

    async presentAlert(posicion) {
        // const alert = await this.alertCtrl.create({
        //     header: '¿Desea colocar una foto?',
        //     message: 'Selecione la opcion de camara o galeria para la foto ',
        //     buttons: [
        //         {
        //             text: 'Cámara',
        //             handler: async () => {
        //                 let photo: Photo = await this.photoService.addNewToCamara();
        //                 //console.log("Foto", photo.webviewPath);
        //                 if (photo) {
        //                     if (posicion == 0) {
        //                         //this.foto1 = photo.webviewPath;
        //                         this.foto1 = this.photoService.devuelve64();
        //                         //console.log(this.foto1.slice(22));
        //                     }
        //                     if (posicion == 1) {
        //                         //this.foto2 = photo.webviewPath;
        //                         //console.log(this.foto2);
        //                         this.foto2 = this.photoService.devuelve64();
        //                     }
        //                     if (posicion == 2) {
        //                         //this.foto3 = photo.webviewPath;
        //                         //console.log(this.foto3);
        //                         this.foto3 = this.photoService.devuelve64();
        //                     }
        //                 }
        //             },
        //         },
        //         {
        //             text: 'Galería',
        //             handler: async () => {
        //                 this.photoService.photos = [];
        //                 let photos: Photo[] = await this.photoService.addNewToGallery();
        //                 // //console.log("Fotos",JSON.stringify(this.photoService.photos));
        //                 if (photos.length == 1) {
        //                     if (posicion == 0) {
        //                         this.foto1 = photos[0].webviewPath;
        //                         console.log('l', posicion);
        //                         // this.foto164= this.photoService.devuelve64();
        //                     }
        //                     if (posicion == 1) {
        //                         this.foto2 = photos[0].webviewPath;
        //                         console.log('l', posicion);
        //                         ////console.log(this.foto1);
        //                         //this.foto264= this.photoService.devuelve64();
        //                     }
        //                     if (posicion == 2) {
        //                         this.foto3 = photos[0].webviewPath;
        //                         console.log('l', this.foto3);
        //                         ////console.log(this.foto1);
        //                         this.foto364 = this.photoService.devuelve64();
        //                     }
        //                 }
        //             },
        //         },
        //         {
        //             text: 'Cancelar',
        //             role: 'cancel',
        //             handler: (event) => {
        //                 if (posicion == 0) {
        //                     this.foto1 = '../../../assets/images/fotoadd.png';
        //                 }
        //                 if (posicion == 1) {
        //                     this.foto2 = '../../../assets/images/fotoadd.png';
        //                 }
        //                 if (posicion == 2) {
        //                     this.foto3 = '../../../assets/images/fotoadd.png';
        //                 }
        //                 ////console.log('Confirm Cancel');
        //             },
        //         },
        //     ],
        // });
        // await alert.present();
    }

    evidenciar() {
        if (
            (this.foto1 != '../../../assets/images/fotoadd.png' ||
                this.foto2 != '../../../assets/images/fotoadd.png' ||
                this.foto3 != '../../../assets/images/fotoadd.png') &&
            this.comentario_evidencia != ''
        ) {
            ////valorles que puedes tomar.estas son las variables

            //this.comentario_evidencia
            //this.foto1.slice(22);
            //this.foto2.slice(22);
            //this.foto3.slice(22);

            this.navCtrl.navigateRoot('/contratados', {
                animated: true,
                animationDirection: 'back',
            });
        } else {
            // No se cumple aqui puedes hacer lo del cartel
            console.log('ssss');
        }
    }
}
