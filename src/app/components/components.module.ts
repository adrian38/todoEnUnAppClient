import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { ApplicationCardComponent } from './application-card/application-card.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
    declarations: [ApplicationCardComponent, HeaderComponent],
    exports: [ApplicationCardComponent, HeaderComponent],
    imports: [CommonModule, IonicModule],
})
export class ComponentsModule {}
