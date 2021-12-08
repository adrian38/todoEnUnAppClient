import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImagenmodalPage } from './imagenmodal.page';

const routes: Routes = [
  {
    path: '',
    component: ImagenmodalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImagenmodalPageRoutingModule {}
