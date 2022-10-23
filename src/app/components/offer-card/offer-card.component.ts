import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TaskModel } from 'src/app/models/task.model';

@Component({
    selector: 'app-offer-card',
    templateUrl: './offer-card.component.html',
    styleUrls: ['./offer-card.component.scss'],
})
export class OfferCardComponent implements OnInit {
    @Input() offer: TaskModel = undefined;
    @Input() index: number = -1;
    @Output() outputShowDialog: EventEmitter<number>;
    @Output() outputOpenChat: EventEmitter<TaskModel>;
    @Output() outputCancelOffer: EventEmitter<TaskModel>;

    constructor() {
        this.outputShowDialog = new EventEmitter();
        this.outputOpenChat = new EventEmitter();
        this.outputCancelOffer = new EventEmitter();
    }

    ngOnInit() {
        console.log('offer', this.offer);
    }

    showDialog() {
        this.outputShowDialog.emit(this.index);
    }

    openChat() {
        this.outputOpenChat.emit(this.offer);
    }

    cancelOffer() {
        this.outputCancelOffer.emit(this.offer);
    }
}
