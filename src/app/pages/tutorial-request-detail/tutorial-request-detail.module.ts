import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TutorialRequestDetailPageRoutingModule } from './tutorial-request-detail-routing.module';

import { DialogModule } from 'primeng/dialog';
import { RatingModule } from 'primeng/rating';

import { TutorialRequestDetailPage } from './tutorial-request-detail.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TutorialRequestDetailPageRoutingModule,
        ComponentsModule,
        ToastModule,
        ButtonModule,
        DialogModule,
        RatingModule,
    ],
    declarations: [TutorialRequestDetailPage],
})
export class TutorialRequestDetailPageModule {}
