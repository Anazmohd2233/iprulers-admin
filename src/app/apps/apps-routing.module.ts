import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: '', loadChildren: () => import('./academics/academics.module').then(m => m.AcademicsModule) },
  { path: '', loadChildren: () => import('./students/students.module').then(m => m.StudentsModule) },
  { path: '', loadChildren: () => import('./videos/videos.module').then(m => m.VideosModule) },



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppsRoutingModule { }
