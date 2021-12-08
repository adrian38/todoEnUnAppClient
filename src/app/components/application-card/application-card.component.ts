import { Component, Input, OnInit } from '@angular/core';
import { TaskModel } from 'src/app/models/task.model';

@Component({
    selector: 'app-application-card',
    templateUrl: './application-card.component.html',
    styleUrls: ['./application-card.component.scss'],
})
export class ApplicationCardComponent implements OnInit {
    @Input() Solicitud: TaskModel;

    titulo: string = '';
    constructor() {}

    ngOnInit() {
        let title = this.Solicitud.title;
        if (title.length > 18) {
            title = title.slice(0, 18) + ' ... ';
        }
        this.titulo = title;
    }
}
