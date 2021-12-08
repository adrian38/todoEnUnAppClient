import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskDescriptionPage } from './task-description.page';

const routes: Routes = [
  {
    path: '',
    component: TaskDescriptionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskDescriptionPageRoutingModule {}
