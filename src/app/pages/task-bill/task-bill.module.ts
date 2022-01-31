import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskBillPageRoutingModule } from './task-bill-routing.module';

import { TaskBillPage } from './task-bill.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
    imports: [ComponentsModule, CommonModule, FormsModule, IonicModule, TaskBillPageRoutingModule],
    declarations: [TaskBillPage],
})
export class TaskBillPageModule {}
