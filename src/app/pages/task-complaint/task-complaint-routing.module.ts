import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskComplaintPage } from './task-complaint.page';

const routes: Routes = [
  {
    path: '',
    component: TaskComplaintPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskComplaintPageRoutingModule {}
