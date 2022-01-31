import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskNewPage } from './task-new.page';

const routes: Routes = [
  {
    path: '',
    component: TaskNewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskNewPageRoutingModule {}
