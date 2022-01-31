import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskOfferPage } from './task-offer.page';

const routes: Routes = [
  {
    path: '',
    component: TaskOfferPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskOfferPageRoutingModule {}
