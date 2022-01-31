import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TutorialOptionsPage } from './tutorial-options.page';

const routes: Routes = [
  {
    path: '',
    component: TutorialOptionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TutorialOptionsPageRoutingModule {}
