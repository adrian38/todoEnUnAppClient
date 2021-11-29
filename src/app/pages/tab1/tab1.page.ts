import { Component } from '@angular/core';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthOdooService } from 'src/app/services/auth-odoo.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  user: UsuarioModel = new UsuarioModel();

  constructor(private _authOdoo: AuthOdooService) {
    this.user.username = 'cliente@example.com';
    this.user.password = 'cliente';

    this._authOdoo.loginClientApk(this.user);
  }
}
