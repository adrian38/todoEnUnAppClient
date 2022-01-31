import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';

import { TaskModel } from 'src/app/models/task.model';
import { TaskOdooService } from 'src/app/services/task-odoo.service';

@Component({
    selector: 'app-task-bill',
    templateUrl: './task-bill.page.html',
    styleUrls: ['./task-bill.page.scss'],
})
export class TaskBillPage implements OnInit {
    manoObra: number = 0;
    materiales: number = 0;
    impuesto: number = 0;
    impuestoPlataforma: number = 0;
    impuestoStrike: number = 0;
    total: number = 0;
    requiereMateriales: boolean = true;

    task: TaskModel;

    constructor(
        public navCtrl: NavController,
        private platform: Platform,
        private _taskOdoo: TaskOdooService
    ) {}

    ngOnInit() {
        this.task = this._taskOdoo.getTaskChat();

        // console.log('nuevo',this.task.materials);
        // console.log('nuevo',this.task.work_force);

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

        this.platform.backButton.subscribeWithPriority(10, () => {
            this.navCtrl.navigateRoot('/contratados', {
                animated: true,
                animationDirection: 'back',
            });
        });
    }

    onClose() {
        this.navCtrl.navigateRoot(this._taskOdoo.getLastRoute(), {
            animated: true,
            animationDirection: 'forward',
        });
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
}
