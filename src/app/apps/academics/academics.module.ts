import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaterialsComponent } from "./materials/materials.component";
import { CategoriesComponent } from "./categories/categories.component";
import { AcademicsRoutingModule } from "./academics-routing.module";

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
import { PageTitleModule } from "src/app/shared/page-title/page-title.module";
import { WidgetModule } from "src/app/shared/widget/widget.module";
import { NgxDropzoneModule } from "ngx-dropzone";
import { AdvancedRoutingModule } from "src/app/pages/tables/advanced/advanced-routing.module";
import { StudentsComponent } from "../students/students/students.component";
import { AdvancedTableModule } from "./materials/advanced-table/advanced-table.module";
import { EditCourseComponent } from './courses/edit-course/edit-course.component';
import { CoursesComponent } from "./courses/course_list/courses.component";

@NgModule({
  declarations: [
    CoursesComponent,
    MaterialsComponent,
    CategoriesComponent,
    EditCourseComponent,
    
  ],
  imports: [
    CommonModule,
    AcademicsRoutingModule,
    CommonModule,
    FormsModule,
    SimplebarAngularModule,
    Select2Module,
    NgbProgressbarModule,
    NgbDatepickerModule,
    NgbTooltipModule,
    NgbAlertModule,
    NgbModalModule,
    NgbTooltipModule,
    NgbDropdownModule,
    NgApexchartsModule,
    WidgetModule,
    PageTitleModule,
    NgxDropzoneModule,
    AdvancedTableModule,
    AdvancedRoutingModule,
    NgbNavModule,
    PageTitleModule,
  ],
})
export class AcademicsModule {}
