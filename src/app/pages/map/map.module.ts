import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MapPageRoutingModule } from './map-routing.module';

import { AgmCoreModule } from '@agm/core';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { MapPage } from './map.page';

//import { ButtonModule } from 'primeng/button';

@NgModule({
    imports: [
        //ButtonModule,
        CommonModule,
        FormsModule,
        IonicModule,
        MapPageRoutingModule,
        AgmCoreModule,
        GooglePlaceModule,
    ],
    declarations: [MapPage],
})
export class MapPageModule {}
