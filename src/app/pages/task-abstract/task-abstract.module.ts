import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskAbstractPageRoutingModule } from './task-abstract-routing.module';

import { TaskAbstractPage } from './task-abstract.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TaskAbstractPageRoutingModule,
        ComponentsModule,
        ToastModule,
        ButtonModule,
    ],
    declarations: [TaskAbstractPage],
})
export class TaskAbstractPageModule {}
