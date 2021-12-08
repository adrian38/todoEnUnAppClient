import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskMaterialsPageRoutingModule } from './task-materials-routing.module';

import { TaskMaterialsPage } from './task-materials.page';

import { ComponentsModule } from 'src/app/components/components.module';
import { ButtonModule } from 'primeng/button';

@NgModule({
    imports: [
        ButtonModule,
        ComponentsModule,
        CommonModule,
        FormsModule,
        IonicModule,
        TaskMaterialsPageRoutingModule,
    ],
    declarations: [TaskMaterialsPage],
})
export class TaskMaterialsPageModule {}
