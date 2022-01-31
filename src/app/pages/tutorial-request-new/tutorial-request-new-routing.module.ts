import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TutorialRequestNewPage } from './tutorial-request-new.page';

const routes: Routes = [
  {
    path: '',
    component: TutorialRequestNewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TutorialRequestNewPageRoutingModule {}
