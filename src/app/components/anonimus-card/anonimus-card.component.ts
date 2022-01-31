import { Component, Input, OnInit } from '@angular/core';
import { TaskModel } from 'src/app/models/task.model';

@Component({
  selector: 'app-anonimus-card',
  templateUrl: './anonimus-card.component.html',
  styleUrls: ['./anonimus-card.component.scss'],
})
export class AnonimusCardComponent implements OnInit {
  @Input() Solicitud: TaskModel;

  //TODO: HTMLMarqueeElement.start() get the marquee and start animation manually
  titulo: string = '';
  constructor() { }

  ngOnInit() {

    //console.log(this.Solicitud)

    let title = this.Solicitud.title;
    if (title.length > 18) {
        title = title.slice(0, 18) + ' ... ';
    }
    this.titulo = title;
}

}
