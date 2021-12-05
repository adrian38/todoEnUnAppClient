import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskSubcategoryPage } from './task-subcategory.page';

const routes: Routes = [
  {
    path: '',
    component: TaskSubcategoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskSubcategoryPageRoutingModule {}
