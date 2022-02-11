import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserPasswordLostPageRoutingModule } from './user-password-lost-routing.module';

import { UserPasswordLostPage } from './user-password-lost.page';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ToastModule,
        UserPasswordLostPageRoutingModule,
        ButtonModule,
    ],
    declarations: [UserPasswordLostPage],
})
export class UserPasswordLostPageModule {}
