import { Component, NgZone, OnInit } from '@angular/core';
import { LoadingController, NavController, Platform } from '@ionic/angular';
import { MessageService } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import { TaskModel } from 'src/app/models/task.model';
import { TaskOdooService } from 'src/app/services/task-odoo.service';

@Component({
    selector: 'app-task-confirm',
    templateUrl: './task-confirm.page.html',
    styleUrls: ['./task-confirm.page.scss'],
    providers: [MessageService],
})
export class TaskConfirmPage implements OnInit {
    manoObra: number = 0;
    materiales: number = 0;
    impuesto: number = 0;
    impuestoPlataforma: number = 0;
    impuestoStrike: number = 0;
    total: number = 0;
    requiereMateriales: boolean = true;

    numero_tarjeta: string = '';
    month: string = '';
    year: string = '';
    cvc: string = '';

    btn_unable: boolean = false;

    /*  */
    year_correcto: boolean = false;
    mes_correcto: boolean = false;
    cvc_correcto: boolean = false;
    correct_card: boolean = false;

    error: boolean = false;
    currentYear: any;

    loading: any;

    notificationNewSoClient$: Observable<any>;
    notificationError$: Observable<any>;

    subscriptionNotificationNewSoClient: Subscription;
    subscriptionNotificationError: Subscription;

    task: TaskModel = new TaskModel();

    constructor(
        private navCtrl: NavController,
        private platform: Platform,
        private messageService: MessageService,
        public loadingController: LoadingController,
        private _taskOdoo: TaskOdooService,
        private ngZone: NgZone
    ) {
        this.task = this._taskOdoo.getTaskChat();
    }

    ngOnInit() {
        //console.log(this.newPromotion, 'promocion a crear nueva');
        this.subscriptions();
        this.manoObra = this.task.work_force;
        this.materiales = this.task.materials;
        //this.impuestoPlataforma = this.impuesto5();
        this.impuesto = this.impuesto21();
        this.impuestoStrike = this.impuestosike();

        // this.total = this.task.budget;
        this.total =
            this.manoObra +
            this.materiales +
            this.impuesto +
            this.impuestoPlataforma +
            this.impuestoStrike;
    }

    ngOnDestroy() {
        this.subscriptionNotificationError.unsubscribe();
        this.subscriptionNotificationNewSoClient.unsubscribe();
    }

    subscriptions() {
        this.platform.backButton.subscribeWithPriority(10, () => {
            this.navCtrl.navigateRoot('/tabs/tab1', {
                animated: true,
                animationDirection: 'back',
            });
        });

        this.notificationError$ = this._taskOdoo.getNotificationError$();
        this.subscriptionNotificationError = this.notificationError$.subscribe(
            (notificationError) => {
                this.ngZone.run(() => {
                    switch (notificationError.type) {
                        case 0:
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Conectandose al Servidor.',
                            });
                            this.btn_unable = false;
                            this.loading.dismiss();
                            break;

                        case 4:
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Error eliminando la oferta.',
                            });
                            this.loading.dismiss();
                            break;

                        case 6:
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Ingresando Dinero a la Plataforma.',
                            });
                            this.btn_unable = false;
                            this.loading.dismiss();
                            break;
                    }
                });
            }
        );

        this.notificationNewSoClient$ = this._taskOdoo.getRequestedTask$();
        this.subscriptionNotificationNewSoClient = this.notificationNewSoClient$.subscribe(
            (offers) => {
                this.ngZone.run(() => {
                    console.log(offers, 'info recibida');

                    switch (offers.type) {
                        case 6:
                            this.loading.dismiss();
                            this._taskOdoo.aplicationListEdit(this.task.So_id, 6, this.task);
                            this.messageService.add({
                                severity: 'success',
                                detail: 'Pago ingresado correctamente',
                            });

                            setTimeout(() => {
                                this.navCtrl.navigateRoot('/tabs/tab1', {
                                    animated: true,
                                    animationDirection: 'back',
                                });
                            }, 2000);

                            break;
                    }
                });
            }
        );
    }

    impuesto21() {
        let impuesto = Math.round(
            ((this.manoObra + this.materiales) /*+ this.impuestoPlataforma */ * 0.21 * 1000) / 1000
        );
        console.log(impuesto);
        return impuesto;
    }

    impuesto5() {
        let impuesto = Math.round(((this.manoObra + this.materiales) * 0.05 * 1000) / 1000);
        console.log(impuesto);
        return impuesto;
    }

    impuestosike() {
        let impuesto = Math.round(
            ((this.manoObra + this.materiales + this.impuesto) /* +   this.impuestoPlataforma */ *
                0.029 *
                1000) /
                1000
        );
        console.log(impuesto);
        return impuesto;
    }

    btn_cancelar() {
        this.navCtrl.navigateRoot('/tabs/tab1', {
            animated: true,
            animationDirection: 'forward',
        });
    }

    btn_pagar() {
        if (
            this.numero_tarjeta !== '' ||
            this.month !== '' ||
            this.year !== '' ||
            this.cvc !== '' /*  */
        ) {
            //this.btn_habilitado = true

            if (this.numero_tarjeta.charAt(0) == '4') {
                let card = {
                    number: this.numero_tarjeta,
                    cvc: this.cvc,
                    exp_month: this.month,
                    exp_year: this.year,
                };

                this.error = this.chekingCard();

                if (!this.error) {
                    this.btn_unable = true;
                    this.presentLoading();
                    this._taskOdoo.acceptProvider(this.task.Po_id, this.task.So_id, card);
                } else {
                    this.mychange(this.numero_tarjeta);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Rectifique su tarjeta.',
                    });
                }
            } else if (
                this.numero_tarjeta.charAt(0) == '5' &&
                (this.numero_tarjeta.charAt(1) == '1' ||
                    this.numero_tarjeta.charAt(1) == '2' ||
                    this.numero_tarjeta.charAt(1) == '3' ||
                    this.numero_tarjeta.charAt(1) == '4' ||
                    this.numero_tarjeta.charAt(1) == '5')
            ) {
                let card = {
                    number: this.numero_tarjeta,
                    cvc: this.cvc,
                    exp_month: this.month,
                    exp_year: this.year,
                };

                this.error = this.chekingCard();

                if (!this.error) {
                    this.btn_unable = true;
                    this.presentLoading();
                    //this._taskOdoo.acceptProvider(offer.Po_id, offer.So_id, card);
                } else {
                    this.mychange(this.numero_tarjeta);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Rectifique su tarjeta.',
                    });
                }
            } else {
                this.year_correcto = true;
                this.mes_correcto = true;
                this.cvc_correcto = true;
                this.correct_card = true;
                this.btn_unable = false;

                this.messageService.add({
                    severity: 'error',
                    detail: 'Rectifique los datos de la tarjeta',
                });
            }
            //this.navCtrl.navigateRoot('/tabs/tab1', {animated: true, animationDirection: 'forward' }) ;
        }
    }
    chekingCard() {
        let numPimpares = [];
        let numPpares = [];
        let suma_impar = 0;
        let suma_par = 0;
        let error = false;

        let chIbn = this.numero_tarjeta.split('-').join('');
        this.numero_tarjeta = chIbn.toString();
        ////console.log(chIbn, 'numero de tarjeta')

        for (let i = 0; i < this.numero_tarjeta.length; i += 2) {
            numPimpares[i] = parseInt(this.numero_tarjeta.charAt(i)) * 2;

            numPimpares[i] = this.numero_simple(numPimpares[i]);

            suma_impar += numPimpares[i];
        }
        for (let p = 1; p < this.numero_tarjeta.length; p += 2) {
            numPpares[p] = parseInt(this.numero_tarjeta.charAt(p));

            suma_par += numPpares[p];
        }

        var dif = (suma_par + suma_impar) % 10;
        ////console.log(dif);

        if (dif != 0) {
            error = true;
        }

        if (this.cvc.length < 3 || this.cvc.charAt(0) == '0') {
            error = true;
        }

        this.currentYear = new Date();
        if (
            parseInt(this.year) < parseInt(this.currentYear.getFullYear('YY').toString().substr(-2))
        ) {
            error = true;
        }

        //////console.log(parseInt(this.mes), "el mes");

        if (parseInt(this.month) > 12) {
            error = true;
        }

        return error;
    }

    numero_simple(digit) {
        if (digit > 9) {
            var tmp = digit.toString();
            var d1 = parseInt(tmp.charAt(0));
            var d2 = parseInt(tmp.charAt(1));
            return d1 + d2;
        } else {
            return digit;
        }
    }

    mychange(val) {
        let chIbn = val.split('-').join('');
        if (chIbn.length > 0) {
            chIbn = chIbn.match(new RegExp('.{1,4}', 'g')).join('-');
        }

        this.numero_tarjeta = chIbn;
    }

    async presentLoading() {
        this.loading = await this.loadingController.create({
            cssClass: 'my-custom-class',
            message: 'Realizando pago...',
            //   duration: 2000
        });

        return this.loading.present();
    }
}
