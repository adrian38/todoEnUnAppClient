import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistrationContractPageRoutingModule } from './registration-contract-routing.module';

import { RegistrationContractPage } from './registration-contract.page';
import { ButtonModule } from 'primeng/button';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RegistrationContractPageRoutingModule,
        ButtonModule,
    ],
    declarations: [RegistrationContractPage],
})
export class RegistrationContractPageModule {}
