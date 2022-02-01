import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistrationContractPageRoutingModule } from './registration-contract-routing.module';

import { RegistrationContractPage } from './registration-contract.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistrationContractPageRoutingModule
  ],
  declarations: [RegistrationContractPage]
})
export class RegistrationContractPageModule {}
