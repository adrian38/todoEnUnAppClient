import { Component, NgZone, OnInit } from '@angular/core';
import { NavController, LoadingController, Platform } from '@ionic/angular';
import { Address, UsuarioModel } from 'src/app/models/usuario.model';
import { ObtSubSService } from 'src/app/services/obt-sub-s.service';
import { SignUpOdooService } from 'src/app/services/signup-odoo.service';
import { Observable, Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-registration-contract',
    templateUrl: './registration-contract.page.html',
    styleUrls: ['./registration-contract.page.scss'],
})
export class RegistrationContractPage implements OnInit {
    aceptar: boolean = true;

    terminos =
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus esse neque odit nam numquam quasi explicabo nemo, sapiente sit molestiae aliquid dolorem cum nesciunt iure, alias beatae! Fuga, excepturi impedit!. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate voluptatum porro voluptatem praesentium accusantium, velit assumenda fugit enim eos explicabo dolorum necessitatibus inventore, dolores possimus distinctio, obcaecati perspiciatis dicta totam?. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut tempora ipsa at, cumque, necessitatibus, laboriosam libero aliquam reiciendis repellat harum magnam. Quibusdam nam sunt non molestias minima architecto vitae ea! Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti dicta aliquam sequi cum quidem, quaerat alias obcaecati optio nemo ex molestias dolores commodi ipsum impedit placeat esse voluptatum architecto deleniti!Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis laboriosam reprehenderit dolore! Porro ad facilis perferendis corrupti laboriosam aperiam veritatis laborum ducimus ratione rerum. Tempore obcaecati velit quia cumque autem. Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis earum iure, nam est qui commodi assumenda repellendus maiores sunt omnis sit aperiam impedit dolore repellat excepturi consequatur adipisci molestiae maxime?. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia alias molestias repellat, hic, placeat voluptatibus, aliquid adipisci cumque aut quos non dolores accusamus minima iusto qui quaerat? Inventore, in temporibus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae necessitatibus natus temporibus quis ratione vel dolores unde magni nemo delectus, odio quidem. Vero illum, adipisci accusantium itaque voluptatibus blanditiis necessitatibus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti suscipit et vero sapiente quam sunt, nam ratione voluptas modi doloribus tempora ut nostrum molestiae deserunt dolore consequatur sed. Ad, ipsum!';

    constructor(
        public datos: ObtSubSService,
        private _signupOdoo: SignUpOdooService,
        private platform: Platform,
        public navCtrl: NavController,
        public loadingController: LoadingController,
        private ngZone: NgZone,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        const elemento = document.getElementById('terminos');
        elemento.innerHTML = this.terminos;

        this.platform.backButton.subscribeWithPriority(10, () => {
            this.navCtrl.navigateRoot('/home', { animated: true, animationDirection: 'back' });
        });
    }
    ngOnDestroy(): void {}

    condiciones() {
        if (this.aceptar == true) this.aceptar = false;
        else this.aceptar = true;
    }

    aceptarregistro() {
        this.navCtrl.navigateRoot('/registration-data-user', {
            animated: true,
            animationDirection: 'forward',
        });
    }
}
