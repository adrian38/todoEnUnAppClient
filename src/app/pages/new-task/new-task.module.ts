import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewTaskPageRoutingModule } from './new-task-routing.module';

import { NewTaskPage } from './new-task.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { ButtonModule } from 'primeng/button';

@NgModule({
    imports: [
        ButtonModule,
        CommonModule,
        FormsModule,
        IonicModule,
        NewTaskPageRoutingModule,
        ComponentsModule,
    ],
    declarations: [NewTaskPage],
})
export class NewTaskPageModule {}
