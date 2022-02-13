import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ComponentsModule } from './components/components.module';

//Services
import { AuthOdooService } from './services/auth-odoo.service';
import { AuthGuardService } from './services/auth-guard.service';
import { TaskOdooService } from './services/task-odoo.service';
import { ObtSubSService } from './services/obt-sub-s.service';
import { SignUpOdooService } from 'src/app/services/signup-odoo.service';
import { LocationService } from 'src/app/services/location.service';

import { AgmCoreModule } from '@agm/core';
import { MessageService } from 'primeng/api';
///////////////////////////////////////////////////////////////

import { LOCALE_ID } from '@angular/core';
import localeEsAr from '@angular/common/locales/es-AR';
registerLocaleData(localeEsAr, 'es');
import { registerLocaleData } from '@angular/common';

import { AppUpdate } from '@ionic-native/app-update/ngx';

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        BrowserAnimationsModule,
        ComponentsModule,
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,

        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyBXq33cjYMCezL6xP-vo3m-qWQ5U9gRTfQ',
        }),
    ],
    providers: [
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        AuthOdooService,
        AuthGuardService,
        TaskOdooService,
        ObtSubSService,
        SignUpOdooService,
        LocationService,
        SplashScreen,
        DatePipe,
        MessageService,
        AppUpdate,
        {
            provide: LOCALE_ID,
            useValue: 'es',
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
