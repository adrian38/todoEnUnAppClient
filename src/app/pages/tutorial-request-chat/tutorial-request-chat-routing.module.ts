import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TutorialRequestChatPage } from './tutorial-request-chat.page';

const routes: Routes = [
  {
    path: '',
    component: TutorialRequestChatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TutorialRequestChatPageRoutingModule {}
