import { Component, Input, OnInit } from '@angular/core';
import { TaskModel } from 'src/app/models/task.model';

@Component({
    selector: 'app-hired-card',
    templateUrl: './hired-card.component.html',
    styleUrls: ['./hired-card.component.scss'],
})
export class HiredCardComponent implements OnInit {
    @Input() contrato: TaskModel = null;
    titulo: string = '';
    legal_status_text: string = 'Denunciado';

    constructor() {}

    ngOnInit() {
        //console.log('sss',this.contrato)
        if (this.contrato && this.contrato.legal_status) {
            if (this.contrato.legal_status_solved === 1) {
                this.legal_status_text = 'Denunciado';
            } else if (this.contrato.legal_status_solved === 2) {
                this.legal_status_text = 'Denuncia\nganada';
            } else if (this.contrato.legal_status_solved === 3) {
                this.legal_status_text = 'Denuncia\nperdida';
            }
        }
        let title = this.contrato.title;
        if (title.length > 18) {
            title = title.slice(0, 18) + ' ... ';
        }
        this.titulo = title;
    }
}
