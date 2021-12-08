import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskLocationPageRoutingModule } from './task-location-routing.module';

import { TaskLocationPage } from './task-location.page';

import { ComponentsModule } from 'src/app/components/components.module';
import { ButtonModule } from 'primeng/button';

@NgModule({
    imports: [
        ButtonModule,
        ComponentsModule,
        CommonModule,
        FormsModule,
        IonicModule,
        TaskLocationPageRoutingModule,
    ],
    declarations: [TaskLocationPage],
})
export class TaskLocationPageModule {}
