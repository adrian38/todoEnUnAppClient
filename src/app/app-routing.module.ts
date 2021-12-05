import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: 'tabs',
        loadChildren: () => import('./pages/tabs/tabs.module').then((m) => m.TabsPageModule),
    },
    {
        path: '',
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
];
@NgModule({
    imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
