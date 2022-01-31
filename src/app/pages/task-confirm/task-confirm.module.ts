import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskConfirmPageRoutingModule } from './task-confirm-routing.module';

import { TaskConfirmPage } from './task-confirm.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TaskConfirmPageRoutingModule,
        ComponentsModule,
        ToastModule,
        ButtonModule,
    ],
    declarations: [TaskConfirmPage],
})
export class TaskConfirmPageModule {}
