import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TutorialRequestDetailPage } from './tutorial-request-detail.page';

const routes: Routes = [
  {
    path: '',
    component: TutorialRequestDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TutorialRequestDetailPageRoutingModule {}
