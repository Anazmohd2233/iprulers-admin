import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { StudentsRoutingModule } from "./students-routingmodule";

import { AdvancedTableModule } from "./advanced-table/advanced-table.module";
import { AdvancedRoutingModule } from "src/app/pages/tables/advanced/advanced-routing.module";
import { PageTitleModule } from "src/app/shared/page-title/page-title.module";
import { StudentsComponent } from "./students/students.component";

import { FormsModule } from "@angular/forms";
import {
  NgbAlertModule,
  NgbDatepickerModule,
  NgbDropdownModule,
  NgbModalModule,
  NgbNavModule,
  NgbProgressbarModule,
  NgbTooltipModule,
} from "@ng-bootstrap/ng-bootstrap";
import { NgApexchartsModule } from "ng-apexcharts";
import { Select2Module } from "ng-select2-component";
import { SimplebarAngularModule } from "simplebar-angular";
import { WidgetModule } from "src/app/shared/widget/widget.module";
import { NgxDropzoneModule } from "ngx-dropzone";
import { EditStudentComponent } from "./edit-student/edit-student.component";
import { UserboxComponent } from "./edit-student/userbox/userbox.component";
import { EditStudentDetailsComponent } from "./edit-student/edit-student-details/edit-student-details.component";
import { StudentCoursesComponent } from './edit-student/student-courses/student-courses.component';
import { StudentMaterialsComponent } from './edit-student/student-materials/student-materials.component';
import { NgbdToastGlobalModule } from "../toaster/toast-global.module";

@NgModule({
  declarations: [
    StudentsComponent,
    EditStudentComponent,
    UserboxComponent,
    EditStudentDetailsComponent,
    StudentCoursesComponent,
    StudentMaterialsComponent,
  ],
  imports: [
    CommonModule,
    StudentsRoutingModule,
    PageTitleModule,
    AdvancedTableModule,
    AdvancedRoutingModule,
    NgbAlertModule,
    NgbDatepickerModule,
    NgbDropdownModule,
    NgbModalModule,
    NgbNavModule,
    NgbProgressbarModule,
    NgbTooltipModule,
    CommonModule,
    FormsModule,
    SimplebarAngularModule,
    Select2Module,
    NgApexchartsModule,
    WidgetModule,
    NgxDropzoneModule,
    NgbdToastGlobalModule

  ],
})
export class StudentsModule {}
