import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesComponent } from './categories/categories.component';
import { MaterialsComponent } from './materials/materials.component';
import { CoursesComponent } from './courses/course_list/courses.component';
import { EditCourseComponent } from './courses/edit-course/edit-course.component';




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
  {
    path: 'courses/:id',
    component: EditCourseComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AcademicsRoutingModule { }
