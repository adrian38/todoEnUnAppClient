import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardTutorialsService } from './services/auth-guard-tutorials.service';
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
    {
        path: 'login',
        loadChildren: () => import('./pages/login/login.module').then((m) => m.LoginPageModule),
    },
    {
        path: 'new-task',
        loadChildren: () =>
            import('./pages/new-task/new-task.module').then((m) => m.NewTaskPageModule),
    },
    {
        path: 'task-subcategory',
        loadChildren: () =>
            import('./pages/task-subcategory/task-subcategory.module').then(
                (m) => m.TaskSubcategoryPageModule
            ),
    },
    {
        path: 'task-materials',
        loadChildren: () =>
            import('./pages/task-materials/task-materials.module').then(
                (m) => m.TaskMaterialsPageModule
            ),
    },
    {
        path: 'task-photos',
        loadChildren: () =>
            import('./pages/task-photos/task-photos.module').then((m) => m.TaskPhotosPageModule),
    },
    {
        path: 'task-description',
        loadChildren: () =>
            import('./pages/task-description/task-description.module').then(
                (m) => m.TaskDescriptionPageModule
            ),
    },
    {
        path: 'task-location',
        loadChildren: () =>
            import('./pages/task-location/task-location.module').then(
                (m) => m.TaskLocationPageModule
            ),
    },
    {
        path: 'map',
        loadChildren: () => import('./pages/map/map.module').then((m) => m.MapPageModule),
    },

    {
        path: 'imagenmodal',
        loadChildren: () =>
            import('./pages/imagenmodal/imagenmodal.module').then((m) => m.ImagenmodalPageModule),
        //canActivate: [AuthGuardService],
    },

    {
        path: 'task-abstract',
        loadChildren: () =>
            import('./pages/task-abstract/task-abstract.module').then(
                (m) => m.TaskAbstractPageModule
            ),
    },
];
@NgModule({
    imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
