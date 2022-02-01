import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistrationDataUserPage } from './registration-data-user.page';

const routes: Routes = [
  {
    path: '',
    component: RegistrationDataUserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrationDataUserPageRoutingModule {}
