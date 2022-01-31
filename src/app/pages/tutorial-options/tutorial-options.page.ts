import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
    selector: 'app-tutorial-options',
    templateUrl: './tutorial-options.page.html',
    styleUrls: ['./tutorial-options.page.scss'],
})
export class TutorialOptionsPage implements OnInit {
    constructor(private navCon: NavController) {}

    ngOnInit() {}

    createNewRequest() {
        this.navCon.navigateRoot('/task-new', { animated: true, animationDirection: 'forward' });
    }
    seeAllRequest() {
        this.navCon.navigateRoot('/tutorial-requests', {
            animated: true,
            animationDirection: 'forward',
        });
    }
}
