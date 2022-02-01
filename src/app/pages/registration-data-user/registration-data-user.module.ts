import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistrationDataUserPageRoutingModule } from './registration-data-user-routing.module';

import { RegistrationDataUserPage } from './registration-data-user.page';
import { ToastModule } from 'primeng/toast';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RegistrationDataUserPageRoutingModule,
        ToastModule,
    ],
    declarations: [RegistrationDataUserPage],
})
export class RegistrationDataUserPageModule {}
