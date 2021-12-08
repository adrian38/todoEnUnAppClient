import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskAbstractPage } from './task-abstract.page';

const routes: Routes = [
  {
    path: '',
    component: TaskAbstractPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskAbstractPageRoutingModule {}
