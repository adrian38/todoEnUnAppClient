import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./pages/tabs/tabs.module').then((m) => m.TabsPageModule),
        canActivate: [AuthGuardService],
    },

    {
        path: 'home',
        loadChildren: () => import('./pages/home/home.module').then((m) => m.HomePageModule),
    },

    // {
    //     path: 'login',
    //     loadChildren: () =>
    //         import('./pages/task-title/task-title.module').then((m) => m.TaskTitlePageModule),
    // },

    {
        path: 'login',
        loadChildren: () => import('./pages/login/login.module').then((m) => m.LoginPageModule),
    },

    {
        path: 'task-subcategory',
        loadChildren: () => import('./pages/task-subcategory/task-subcategory.module').then((m) => m.TaskSubcategoryPageModule),
        canActivate: [AuthGuardService],
    },
    {
        path: 'task-materials',
        loadChildren: () => import('./pages/task-materials/task-materials.module').then((m) => m.TaskMaterialsPageModule),
        canActivate: [AuthGuardService],
    },
    {
        path: 'task-photos',
        loadChildren: () => import('./pages/task-photos/task-photos.module').then((m) => m.TaskPhotosPageModule),
        canActivate: [AuthGuardService],
    },
    {
        path: 'task-description',
        loadChildren: () => import('./pages/task-description/task-description.module').then((m) => m.TaskDescriptionPageModule),
        canActivate: [AuthGuardService],
    },
    {
        path: 'task-location',
        loadChildren: () => import('./pages/task-location/task-location.module').then((m) => m.TaskLocationPageModule),
        canActivate: [AuthGuardService],
    },
    {
        path: 'map',
        loadChildren: () => import('./pages/map/map.module').then((m) => m.MapPageModule),
    },

    {
        path: 'imagenmodal',
        loadChildren: () => import('./pages/imagenmodal/imagenmodal.module').then((m) => m.ImagenmodalPageModule),
        canActivate: [AuthGuardService],
    },

    {
        path: 'task-abstract',
        loadChildren: () => import('./pages/task-abstract/task-abstract.module').then((m) => m.TaskAbstractPageModule),
        canActivate: [AuthGuardService],
    },
    {
        path: 'map-detail',
        loadChildren: () => import('./pages/map-detail/map-detail.module').then((m) => m.MapDetailPageModule),
        canActivate: [AuthGuardService],
    },
    {
        path: 'task-new',
        loadChildren: () => import('./pages/task-new/task-new.module').then((m) => m.TaskNewPageModule),
        canActivate: [AuthGuardService],
    },
    {
        path: 'task-offer',
        loadChildren: () => import('./pages/task-offer/task-offer.module').then((m) => m.TaskOfferPageModule),
        canActivate: [AuthGuardService],
    },
    {
        path: 'chat',
        loadChildren: () => import('./pages/chat/chat.module').then((m) => m.ChatPageModule),
        canActivate: [AuthGuardService],
    },
    {
        path: 'task-confirm',
        loadChildren: () => import('./pages/task-confirm/task-confirm.module').then((m) => m.TaskConfirmPageModule),
        canActivate: [AuthGuardService],
    },
    {
        path: 'task-hired',
        loadChildren: () => import('./pages/task-hired/task-hired.module').then((m) => m.TaskHiredPageModule),
        canActivate: [AuthGuardService],
    },
    {
        path: 'task-bill',
        loadChildren: () => import('./pages/task-bill/task-bill.module').then((m) => m.TaskBillPageModule),
        canActivate: [AuthGuardService],
    },
    {
        path: 'task-complaint',
        loadChildren: () => import('./pages/task-complaint/task-complaint.module').then((m) => m.TaskComplaintPageModule),
        canActivate: [AuthGuardService],
    },
    {
        path: 'user-data',
        loadChildren: () => import('./pages/user-data/user-data.module').then((m) => m.UserDataPageModule),
        canActivate: [AuthGuardService],
    },
    {
        path: 'user-password',
        loadChildren: () => import('./pages/user-password/user-password.module').then((m) => m.UserPasswordPageModule),
        canActivate: [AuthGuardService],
    },
    {
        path: 'promotions',
        loadChildren: () => import('./pages/promotions/promotions.module').then((m) => m.PromotionsPageModule),
        canActivate: [AuthGuardService],
    },
    {
        path: 'notifications',
        loadChildren: () => import('./pages/notifications/notifications.module').then((m) => m.NotificationsPageModule),
        canActivate: [AuthGuardService],
    },
    {
        path: 'about',
        loadChildren: () => import('./pages/about/about.module').then((m) => m.AboutPageModule),
        canActivate: [AuthGuardService],
    },

    {
        path: 'tutorial-options',
        loadChildren: () => import('./pages/tutorial-options/tutorial-options.module').then((m) => m.TutorialOptionsPageModule),
        canActivate: [AuthGuardService],
    },
    {
        path: 'tutorial-requests',
        loadChildren: () => import('./pages/tutorial-requests/tutorial-requests.module').then((m) => m.TutorialRequestsPageModule),
        canActivate: [AuthGuardService],
    },
    {
        path: 'tutorial-request-detail',
        loadChildren: () => import('./pages/tutorial-request-detail/tutorial-request-detail.module').then((m) => m.TutorialRequestDetailPageModule),
        canActivate: [AuthGuardService],
    },
    {
        path: 'tutorial-request-chat',
        loadChildren: () => import('./pages/tutorial-request-chat/tutorial-request-chat.module').then((m) => m.TutorialRequestChatPageModule),
        canActivate: [AuthGuardService],
    },
    {
        path: 'tutorial-request-new',
        loadChildren: () => import('./pages/tutorial-request-new/tutorial-request-new.module').then((m) => m.TutorialRequestNewPageModule),
        canActivate: [AuthGuardService],
    },
    {
        path: 'registration-contract',
        loadChildren: () => import('./pages/registration-contract/registration-contract.module').then((m) => m.RegistrationContractPageModule),
    },
    {
        path: 'registration-data-user',
        loadChildren: () => import('./pages/registration-data-user/registration-data-user.module').then((m) => m.RegistrationDataUserPageModule),
    },
    {
        path: 'user-password-lost',
        loadChildren: () => import('./pages/user-password-lost/user-password-lost.module').then((m) => m.UserPasswordLostPageModule),
    },
    {
        path: 'task-title',
        loadChildren: () => import('./pages/task-title/task-title.module').then((m) => m.TaskTitlePageModule),
        canActivate: [AuthGuardService],
    },
];
@NgModule({
    imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
