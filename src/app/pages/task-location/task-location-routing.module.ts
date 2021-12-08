import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskLocationPage } from './task-location.page';

const routes: Routes = [
  {
    path: '',
    component: TaskLocationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskLocationPageRoutingModule {}
