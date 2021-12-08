import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskPhotosPage } from './task-photos.page';

const routes: Routes = [
  {
    path: '',
    component: TaskPhotosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskPhotosPageRoutingModule {}
