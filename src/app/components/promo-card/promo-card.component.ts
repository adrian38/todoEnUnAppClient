import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TaskModel } from 'src/app/models/task.model';

@Component({
  selector: 'app-promo-card',
  templateUrl: './promo-card.component.html',
  styleUrls: ['./promo-card.component.scss'],
})
export class PromoCardComponent implements OnInit {

  @Input() Promo: TaskModel = undefined;
  @Input() index: number = -1;
  @Output() outputPromoInfo: EventEmitter<TaskModel>;

  constructor() {
    this.outputPromoInfo = new EventEmitter();
  }

  ngOnInit() {}

  getPromoInfo() {
    this.outputPromoInfo.emit(this.Promo);
}

}
