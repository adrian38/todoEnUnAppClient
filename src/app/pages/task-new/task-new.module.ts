import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskNewPageRoutingModule } from './task-new-routing.module';

import { TaskNewPage } from './task-new.page';

import { ComponentsModule } from 'src/app/components/components.module';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';

@NgModule({
    imports: [
        RatingModule,
        ComponentsModule,
        ButtonModule,
        CommonModule,
        FormsModule,
        IonicModule,
        TaskNewPageRoutingModule,
    ],
    declarations: [TaskNewPage],
})
export class TaskNewPageModule {}
