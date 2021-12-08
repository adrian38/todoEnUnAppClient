import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskPhotosPageRoutingModule } from './task-photos-routing.module';

import { TaskPhotosPage } from './task-photos.page';

import { ComponentsModule } from 'src/app/components/components.module';
import { ButtonModule } from 'primeng/button';
//import { SafeUrlPipePipe } from 'src/app/pipes/safe-url-pipe.pipe';

@NgModule({
    imports: [
        //SafeUrlPipePipe,
        ButtonModule,
        ComponentsModule,
        CommonModule,
        FormsModule,
        IonicModule,
        TaskPhotosPageRoutingModule,
    ],
    declarations: [TaskPhotosPage],
    exports: [],
})
export class TaskPhotosPageModule {}
