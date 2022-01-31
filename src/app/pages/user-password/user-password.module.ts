import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserPasswordPageRoutingModule } from './user-password-routing.module';

import { UserPasswordPage } from './user-password.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        UserPasswordPageRoutingModule,
        ComponentsModule,
        ToastModule,
        ButtonModule,
    ],
    declarations: [UserPasswordPage],
})
export class UserPasswordPageModule {}
