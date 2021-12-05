import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskSubcategoryPageRoutingModule } from './task-subcategory-routing.module';

import { TaskSubcategoryPage } from './task-subcategory.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaskSubcategoryPageRoutingModule
  ],
  declarations: [TaskSubcategoryPage]
})
export class TaskSubcategoryPageModule {}
