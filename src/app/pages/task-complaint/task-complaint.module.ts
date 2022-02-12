import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskComplaintPageRoutingModule } from './task-complaint-routing.module';

import { TaskComplaintPage } from './task-complaint.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

@NgModule({
    imports: [
        ComponentsModule,
        CommonModule,
        FormsModule,
        IonicModule,
        TaskComplaintPageRoutingModule,
        ButtonModule,
        ToastModule,
    ],
    declarations: [TaskComplaintPage],
})
export class TaskComplaintPageModule {}
