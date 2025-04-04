import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { StudentsComponent } from './students/students.component';
import { EditStudentComponent } from './edit-student/edit-student.component';




const routes: Routes = [
  
  {
    path: 'students',
    component: StudentsComponent
  },
  {
    path: 'edit_student',
    component: EditStudentComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentsRoutingModule { }
