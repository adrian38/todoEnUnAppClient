import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { ObtSubSService } from 'src/app/services/obt-sub-s.service';

@Component({
    selector: 'app-task-subcategory',
    templateUrl: './task-subcategory.page.html',
    styleUrls: ['./task-subcategory.page.scss'],
})
export class TaskSubcategoryPage implements OnInit {
    subTaskTypes: string[] = [
        'Cambio de llaves de paso',
        'Cambio de grifería',
        'Cambio de sifón',
        'Radiadores y calefacción',
        'otros',
        // "Pequeño desatasco",
        // "Gran desatasco",
        // "Mecanismo cisterna",
        // "Termos y calderas",
        // "Contadores de agua",
        // "Reforma pequeña",
        // "Reforma integral",
        // "Arreglo urgente de fuga"
    ];

    constructor(public navCtrl: NavController, private platform: Platform, private _serv: ObtSubSService) {}

    ngOnInit() {
        this._serv.deleteFields();
        this.subscriptions();
    }

    subscriptions() {
        this.platform.backButton.subscribeWithPriority(10, () => {
            this.navCtrl.navigateRoot('/task-new', {
                animated: true,
                animationDirection: 'back',
            });
        });
    }

    subTaskSelected(selected: number) {
        let id = 'img' + selected.toString();

        const tutorial = sessionStorage.getItem('tutorial');

        if (tutorial === 'true') {
            document.getElementById(id).className = 'jello-horizontal';
            this._serv.setTitulo(this.subTaskTypes[selected]);

            setTimeout(() => {
                this.navCtrl.navigateRoot('/task-photos', {
                    animated: true,
                    animationDirection: 'forward',
                });
            }, 800);
        } else {
            this._serv.set_sub_servicio_activo(selected);

            console.log('************* this.subTaskTypes[selected] *************');
            console.log(this.subTaskTypes[selected]);

            if (this.subTaskTypes[selected] === 'otros') {
                document.getElementById(id).className = 'jello-horizontal';

                setTimeout(() => {
                    this.navCtrl.navigateRoot('/task-title', {
                        animated: true,
                        animationDirection: 'forward',
                    });
                }, 800);
            } else {
                this._serv.setTitulo(this.subTaskTypes[selected]);

                document.getElementById(id).className = 'jello-horizontal';

                setTimeout(() => {
                    this.navCtrl.navigateRoot('/task-materials', {
                        animated: true,
                        animationDirection: 'forward',
                    });
                }, 800);
            }
        }
    }
}
