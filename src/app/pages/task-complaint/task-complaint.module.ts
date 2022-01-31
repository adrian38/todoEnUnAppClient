import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskComplaintPageRoutingModule } from './task-complaint-routing.module';

import { TaskComplaintPage } from './task-complaint.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
    imports: [
        ComponentsModule,
        CommonModule,
        FormsModule,
        IonicModule,
        TaskComplaintPageRoutingModule,
    ],
    declarations: [TaskComplaintPage],
})
export class TaskComplaintPageModule {}
