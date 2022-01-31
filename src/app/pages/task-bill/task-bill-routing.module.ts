import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskBillPage } from './task-bill.page';

const routes: Routes = [
  {
    path: '',
    component: TaskBillPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskBillPageRoutingModule {}
