import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TutorialRequestsPage } from './tutorial-requests.page';

const routes: Routes = [
  {
    path: '',
    component: TutorialRequestsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TutorialRequestsPageRoutingModule {}
