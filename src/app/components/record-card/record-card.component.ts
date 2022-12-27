import { Component, Input, OnInit } from '@angular/core';
import { TaskModel } from 'src/app/models/task.model';

@Component({
    selector: 'app-record-card',
    templateUrl: './record-card.component.html',
    styleUrls: ['./record-card.component.scss'],
})
export class RecordCardComponent implements OnInit {
    @Input() record: TaskModel = null;
    titulo: string = '';
    legal_status_text: string = 'Denunciado';

    constructor() {}

    ngOnInit() {
        //console.log('record',this.record)
        if (this.record && this.record.legal_status) {
            if (this.record.legal_status_solved === 1) {
                this.legal_status_text = 'Denunciado';
            } else if (this.record.legal_status_solved === 2) {
                this.legal_status_text = 'Denuncia\nganada';
            } else if (this.record.legal_status_solved === 3) {
                this.legal_status_text = 'Denuncia\nperdida';
            }
        }
        let title = this.record.title;
        if (title.length > 18) {
            title = title.slice(0, 18) + ' ... ';
        }
        this.titulo = title;
    }
}
