import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskTitlePageRoutingModule } from './task-title-routing.module';

import { TaskTitlePage } from './task-title.page';
import { ButtonModule } from 'primeng/button';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
    imports: [
        ButtonModule,
        ComponentsModule,
        CommonModule,
        FormsModule,
        IonicModule,
        TaskTitlePageRoutingModule,
    ],
    declarations: [TaskTitlePage],
})
export class TaskTitlePageModule {}
