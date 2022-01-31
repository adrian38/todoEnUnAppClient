import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskOfferPageRoutingModule } from './task-offer-routing.module';

import { TaskOfferPage } from './task-offer.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { RatingModule } from 'primeng/rating';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TaskOfferPageRoutingModule,
        ComponentsModule,
        ToastModule,
        DialogModule,
        RatingModule,
    ],
    declarations: [TaskOfferPage],
})
export class TaskOfferPageModule {}
