import { Location } from '@angular/common';
import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { ObtSubSService } from 'src/app/services/obt-sub-s.service';
import { TaskOdooService } from 'src/app/services/task-odoo.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output() clickedClose = new EventEmitter();
  @Input() expandText: string = "Text";
  @Input() titulo: boolean = false;
  @Input() expandHeader: boolean = false;
  @Input() fillBackground: boolean = false;
  @Input() cerrar: boolean = false;
  @Input() atras: boolean = false;
  @Input() headerText: string = "Header";


  notification: boolean = false;

  notification$: Observable<boolean>;
  subscriptionNotification: Subscription;

  ruta: string = "";

  constructor(private _location: Location,
    private navCon: NavController,
    private _taskOdoo: TaskOdooService,
    private ngZone: NgZone,
    private datos: ObtSubSService,
    private router: Router) {

  }

  ngOnInit() {

    this.notification = this._taskOdoo.getNotification()
    this._taskOdoo.setRoute(this.router.url);
    //console.log(this.router.url);
    // this.ruta = this.datos.getruta();
    this.subscriptions();
  }

  ngOnDestroy() {


    this.subscriptionNotification.unsubscribe();
    // this.subscriptionNotificationOff.unsubscribe();

  }

  closeEvent() {
    this.clickedClose.emit();
  }

  subscriptions() {

    this.notification$ = this._taskOdoo.getNotificationNav$();
    this.subscriptionNotification = this.notification$.subscribe(
      (notiAlert: boolean) => {
        this.ngZone.run(() => {

          if (notiAlert) {
            this.notification = true;
          }

        });
      }
    );

  }

  backEvent() {


    if (this._location.isCurrentPathEqualTo('/materiales')) {

      if (this.ruta == "option") {
        this.navCon.navigateRoot('/option', { animated: true, animationDirection: 'back' });
      }
      else {
        this.navCon.navigateRoot('/option', { animated: true, animationDirection: 'back' });
      }

    }
    if (this._location.isCurrentPathEqualTo('/titulo')) {
      this.navCon.navigateRoot('/option', { animated: true, animationDirection: 'back' });

    }

    if (this._location.isCurrentPathEqualTo('/horarios')) {
      this.navCon.navigateRoot('/materiales', { animated: true, animationDirection: 'back' });

    }


    if (this._location.isCurrentPathEqualTo('/direccion')) {
      this.navCon.navigateRoot('/horarios', { animated: true, animationDirection: 'back' });

    }

    if (this._location.isCurrentPathEqualTo('/comentario')) {
      this.navCon.navigateRoot('/direccion', { animated: true, animationDirection: 'back' });

    }

    if (this._location.isCurrentPathEqualTo('/foto')) {
      this.navCon.navigateRoot('/comentario', { animated: true, animationDirection: 'back' });

    }

    if (this._location.isCurrentPathEqualTo('/resumen')) {
      this.navCon.navigateRoot('/foto', { animated: true, animationDirection: 'back' });

    }
  }

  vernotificaciones() {
    console.log("toque la campana")
    this.navCon.navigateRoot('/notificaciones', { animated: true, animationDirection: 'back' });
  }

}
