import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { ApplicationCardComponent } from './application-card/application-card.component';
import { HiredCardComponent } from './hired-card/hired-card.component';
import { RecordCardComponent } from './record-card/record-card.component';
import { OfferCardComponent } from './offer-card/offer-card.component';
import { AnonimusCardComponent } from './anonimus-card/anonimus-card.component';

import { IonicModule } from '@ionic/angular';

@NgModule({
    declarations: [
        ApplicationCardComponent,
        HeaderComponent,
        HiredCardComponent,
        RecordCardComponent,
        OfferCardComponent,
        AnonimusCardComponent,
    ],
    exports: [
        ApplicationCardComponent,
        HeaderComponent,
        HiredCardComponent,
        RecordCardComponent,
        OfferCardComponent,
        AnonimusCardComponent,
    ],
    imports: [CommonModule, IonicModule],
})
export class ComponentsModule {}
