import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TutorialRequestsPageRoutingModule } from './tutorial-requests-routing.module';

import { TutorialRequestsPage } from './tutorial-requests.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { ToastModule } from 'primeng/toast';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TutorialRequestsPageRoutingModule,
        ComponentsModule,
        ToastModule,
    ],
    declarations: [TutorialRequestsPage],
})
export class TutorialRequestsPageModule {}
