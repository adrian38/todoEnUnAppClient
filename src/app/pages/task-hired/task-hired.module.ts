import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskHiredPageRoutingModule } from './task-hired-routing.module';

import { TaskHiredPage } from './task-hired.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { RatingModule } from 'primeng/rating';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TaskHiredPageRoutingModule,
        ComponentsModule,
        ToastModule,
        ButtonModule,
        DialogModule,
        RatingModule,
    ],
    declarations: [TaskHiredPage],
})
export class TaskHiredPageModule {}
