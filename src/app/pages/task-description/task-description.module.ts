import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskDescriptionPageRoutingModule } from './task-description-routing.module';

import { TaskDescriptionPage } from './task-description.page';

import { ComponentsModule } from 'src/app/components/components.module';
import { ButtonModule } from 'primeng/button';

@NgModule({
    imports: [
        ButtonModule,
        ComponentsModule,
        CommonModule,
        FormsModule,
        IonicModule,
        TaskDescriptionPageRoutingModule,
    ],
    declarations: [TaskDescriptionPage],
})
export class TaskDescriptionPageModule {}
