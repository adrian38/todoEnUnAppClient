import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, NavController, Platform } from '@ionic/angular';
import { MessageService } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { ChatOdooService } from 'src/app/services/chat-odoo.service';
import { ObtSubSService } from 'src/app/services/obt-sub-s.service';
import { TaskOdooService } from 'src/app/services/task-odoo.service';
import { Address, TaskModel } from '../../models/task.model';

@Component({
    selector: 'app-tutorial-request-new',
    templateUrl: './tutorial-request-new.page.html',
    styleUrls: ['./tutorial-request-new.page.scss'],
})
export class TutorialRequestNewPage implements OnInit {
    name: string;
    lastName: string;
    btn_deshabilitado: boolean = false;

    //user: UsuarioModel;
    task: TaskModel;
    btn_deshabilitar: boolean = false;
    usuario: UsuarioModel;

    servicio: string = '';
    titulo: string;
    check: boolean;
    fecha: string;
    hora: string;
    hora1: Date;
    comentario: string;
    calle: string = '';
    piso: string = '';
    numero: string = '';
    puerta: string = '';
    portal: string = '';
    cod_postal: string = '';
    escalera: string = '';
    latitud: string = '';
    longitud: string = '';
    loading: any;
    foto0: string = '';
    foto1: string = '';
    foto2: string = '';
    city: string = '';

    notificationNewSoClient$: Observable<any>;
    notificationError$: Observable<any>;

    subscriptionNotificationNewSoClient: Subscription;
    subscriptionNotificationError: Subscription;

    taskToSend;

    constructor(
        private navCon: NavController,
        private datos: ObtSubSService,
        private ngZone: NgZone,
        private messageService: MessageService,
        private _taskOdoo: TaskOdooService,
        public navCtrl: NavController,
        public loadingController: LoadingController,
        private _chatOdoo: ChatOdooService,
        private router: Router,
        private platform: Platform
    ) {}

    ngOnInit() {
        // this.servicio = this.datos.getServ();
        // this.titulo = this.datos.get_sub_servicio_activo();
        // this.check = this.datos.getUtiles();
        // this.fecha = this.datos.getCalendarioD();
        // this.hora1 = this.datos.getCalendarioT();
        //this.hora = this.date.transform(this.hora1, 'HH:mm:ss');
        // this.comentario = this.datos.getcomentario();
        // this.calle = this.datos.getcalle();
        // this.portal = this.datos.getportal();
        // this.puerta = this.datos.getpuerta();
        // this.cod_postal = this.datos.getcod_postal();
        // this.escalera = this.datos.getescalera();
        // this.piso = this.datos.getpiso();
        // this.numero = this.datos.getnumero();
        //this.user = this._authOdoo.getUser();

        this.name = this.datos.getAnonimusName();
        this.lastName = this.datos.getAnonimusLastName();

        this.subscriptions();
    }

    ngOnDestroy() {
        this.subscriptionNotificationError.unsubscribe();
        this.subscriptionNotificationNewSoClient.unsubscribe();
    }

    subscriptions() {
        this.platform.backButton.subscribeWithPriority(10, () => {
            this.navCtrl.navigateRoot('/option', { animated: true, animationDirection: 'back' });
        });

        this.notificationError$ = this._taskOdoo.getNotificationError$();
        this.subscriptionNotificationError = this.notificationError$.subscribe(
            (notificationError) => {
                this.ngZone.run(() => {
                    switch (notificationError.type) {
                        case 0:
                            this.loading.dismiss();
                            this.messageService.add({
                                severity: 'error',
                                detail: 'Error en su conexión',
                            });
                            this.btn_deshabilitar = false;
                            break;

                        case 8:
                            this.loading.dismiss();
                            this.messageService.add({
                                severity: 'error',
                                detail: 'No se creo la tarea',
                            });
                            this.btn_deshabilitar = false;
                            break;
                    }
                });
            }
        );

        this.notificationNewSoClient$ = this._taskOdoo.getRequestedTask$();
        this.subscriptionNotificationNewSoClient = this.notificationNewSoClient$.subscribe(
            (notificationNewSoClient) => {
                this.ngZone.run(() => {
                    switch (notificationNewSoClient.type) {
                        case 7:
                            this.loading.dismiss();
                            console.log('tarea creada correctamente');
                            this.messageService.add({
                                severity: 'success',
                                detail: 'Tarea creada correctamente',
                            });
                            this.borrar_campos();
                            setTimeout(() => {
                                this.navCtrl.navigateRoot('/tutorial-requests', {
                                    animated: true,
                                    animationDirection: 'forward',
                                });
                            }, 2000);
                            break;
                    }
                });
            }
        );
    }

    onSubmit() {
        if (this.datos.getlatitud() && this.datos.getCity()) {
            this.presentLoading();

            this.task = new TaskModel();
            this.task.address = new Address('', '', '', '', '', '', '', '', '', 0);

            // this.task.require_materials = this.datos.getUtiles();
            // this.task.description = this.datos.getcomentario();
            // this.task.address.street = this.datos.getcalle();
            // this.task.address.door = this.datos.getpuerta();
            // this.task.address.stair = this.datos.getescalera();
            // this.task.address.portal = this.datos.getportal();
            // this.task.address.cp = this.datos.getcod_postal();
            // this.task.address.number = this.datos.getnumero();
            // this.task.address.floor = this.datos.getpiso();
            this.task.address.latitude = String(this.datos.getlatitud());
            this.task.address.longitude = String(this.datos.getlongitud());
            this.task.address.street = this.datos.getCity();
            this.task.title = this.datos.gettitulo();
            this.task.product_id = 39;
            this.task.type = 'Servicio de Fontaneria';
            this.task.anonimus = true;
            this.task.anonimus_author = this.name + ' ' + this.lastName;

            if (this.datos.getfoto00() !== '/assets/images/fotoadd.png') {
                this.task.photoSO.push(this.datos.getfoto00());
            }
            if (this.datos.getfoto11() !== '/assets/images/fotoadd.png') {
                this.task.photoSO.push(this.datos.getfoto11());
            }
            if (this.datos.getfoto22() !== '/assets/images/fotoadd.png') {
                this.task.photoSO.push(this.datos.getfoto22());
            }

            // this.task.date_planned = this.fecha;
            // this.task.time = this.hora;

            this.task.date_planned = '2020-10-20';
            this.task.time = '07:30:30';

            this.task.client_id = 217;

            this.taskToSend = { ...this.task };
            this.taskToSend.photoSO = [...this.task.photoSO];
            console.log('before', this.taskToSend);

            for (let [index, element] of this.taskToSend.photoSO.entries()) {
                if (
                    Buffer.from(element.substring(element.indexOf(',') + 1)).length / 1e6 >
                    0.322216
                ) {
                    this.resizedataURL(element, 1280, 960, index);
                } else {
                    element = element.substring(element.indexOf(',') + 1);
                }
            }

            //console.log(this.task, "tarea a crear")
            this.btn_deshabilitar = true;

            //var today = new Date();
            //var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            //var str = date.toString("yyyy-mm-dd");
            //var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            //var dateTime = date+' '+time;

            //console.log(dateTime)

            this._taskOdoo.newTaskAnonimus(this.taskToSend);
        } else {
            this.messageService.add({
                severity: 'error',
                detail: 'Ubique su direccion en el mapa',
            });
        }
    }

    ubicacion() {
        this.datos.setruta(this.router.url);
        this.datos.setAnonimusName(this.name);
        this.datos.setAnonimusLastName(this.lastName);

        this.navCtrl.navigateRoot('/map', { animated: true, animationDirection: 'back' });
    }

    async presentLoading() {
        this.loading = await this.loadingController.create({
            cssClass: 'my-custom-class',
            message: 'Creando Solicitud...',
        });

        return this.loading.present();
    }

    borrar_campos() {
        this.datos.setTitulo('');
        this.datos.setServ('');
        this.datos.setAnonimusName('');
        this.datos.setAnonimusLastName('');

        this.datos.deleteFields();
        // this.datos.setcalle('');
        // this.datos.setpuerta('');
        // this.datos.setpiso('');
        // this.datos.setescalera('');
        // this.datos.setcod_postal('');
        // this.datos.setnumero('');
        // this.datos.setportal('');
        // this.datos.setradiobuton(false);
        // this.datos.setcomentario('');
        // this.datos.setfoto00('../../../assets/fotoadd.png');
        // this.datos.setfoto11('../../../assets/fotoadd.png');
        // this.datos.setfoto22('../../../assets/fotoadd.png');
        // this.datos.setfoto0('');
        // this.datos.setfoto1('');
        // this.datos.setfoto2('');
    }

    resizedataURL(datas, wantedWidth, wantedHeight, index) {
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
            this.taskToSend.photoSO[index] = temp.substring(temp.indexOf(',') + 1);
        };
    }
}
