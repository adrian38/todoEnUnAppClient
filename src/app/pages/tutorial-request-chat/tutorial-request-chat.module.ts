import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TutorialRequestChatPageRoutingModule } from './tutorial-request-chat-routing.module';

import { TutorialRequestChatPage } from './tutorial-request-chat.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TutorialRequestChatPageRoutingModule,
        ComponentsModule,
        ToastModule,
        ButtonModule,
    ],
    declarations: [TutorialRequestChatPage],
})
export class TutorialRequestChatPageModule {}
