import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserPasswordLostPage } from './user-password-lost.page';

const routes: Routes = [
  {
    path: '',
    component: UserPasswordLostPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserPasswordLostPageRoutingModule {}
