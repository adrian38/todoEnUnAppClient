import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistrationContractPage } from './registration-contract.page';

const routes: Routes = [
  {
    path: '',
    component: RegistrationContractPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrationContractPageRoutingModule {}
