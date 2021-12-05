import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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

///////////////////////////////////////////////////////////////

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        BrowserAnimationsModule,
        ComponentsModule,
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
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
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
