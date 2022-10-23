import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskTitlePage } from './task-title.page';

const routes: Routes = [
  {
    path: '',
    component: TaskTitlePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskTitlePageRoutingModule {}
