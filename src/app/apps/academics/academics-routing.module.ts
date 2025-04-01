import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesComponent } from './categories/categories.component';
import { CoursesComponent } from './courses/courses.component';
import { MaterialsComponent } from './materials/materials.component';




const routes: Routes = [
  
  {
    path: 'categories',
    component: CategoriesComponent
  },
  {
    path: 'courses',
    component: CoursesComponent
  },
  {
    path: 'materials',
    component: MaterialsComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AcademicsRoutingModule { }
