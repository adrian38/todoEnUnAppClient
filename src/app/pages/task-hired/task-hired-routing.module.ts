import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskHiredPage } from './task-hired.page';

const routes: Routes = [
  {
    path: '',
    component: TaskHiredPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskHiredPageRoutingModule {}
