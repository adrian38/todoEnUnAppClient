import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskMaterialsPage } from './task-materials.page';

const routes: Routes = [
  {
    path: '',
    component: TaskMaterialsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskMaterialsPageRoutingModule {}
