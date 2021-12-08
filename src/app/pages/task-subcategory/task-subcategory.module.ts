import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskSubcategoryPageRoutingModule } from './task-subcategory-routing.module';

import { TaskSubcategoryPage } from './task-subcategory.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
    imports: [
        ComponentsModule,
        CommonModule,
        FormsModule,
        IonicModule,
        TaskSubcategoryPageRoutingModule,
    ],
    declarations: [TaskSubcategoryPage],
})
export class TaskSubcategoryPageModule {}
