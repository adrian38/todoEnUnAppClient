import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TutorialOptionsPageRoutingModule } from './tutorial-options-routing.module';

import { TutorialOptionsPage } from './tutorial-options.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { ButtonModule } from 'primeng/button';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TutorialOptionsPageRoutingModule,
        ComponentsModule,
        ButtonModule,
    ],
    declarations: [TutorialOptionsPage],
})
export class TutorialOptionsPageModule {}
