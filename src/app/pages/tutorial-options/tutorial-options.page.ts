import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';

@Component({
    selector: 'app-tutorial-options',
    templateUrl: './tutorial-options.page.html',
    styleUrls: ['./tutorial-options.page.scss'],
})
export class TutorialOptionsPage implements OnInit {
    constructor(private navCon: NavController, private platform: Platform) {}

    ngOnInit() {
        this.platform.backButton.subscribeWithPriority(10, () => {
            this.navCon.navigateRoot('/home', {
                animated: true,
                animationDirection: 'back',
            });
        });
    }

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
