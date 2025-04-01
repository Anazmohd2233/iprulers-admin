import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoursesComponent } from './courses/courses.component';
import { MaterialsComponent } from './materials/materials.component';
import { CategoriesComponent } from './categories/categories.component';
import { AcademicsRoutingModule } from './academics-routing.module';


import { FormsModule } from "@angular/forms";
import {
  NgbAlertModule,
  NgbDatepickerModule,
  NgbDropdownModule,
  NgbModalModule,
  NgbProgressbarModule,
  NgbTooltipModule,
} from "@ng-bootstrap/ng-bootstrap";
import { NgApexchartsModule } from "ng-apexcharts";
import { Select2Module } from "ng-select2-component";
import { SimplebarAngularModule } from "simplebar-angular";
import { PageTitleModule } from "src/app/shared/page-title/page-title.module";
import { WidgetModule } from "src/app/shared/widget/widget.module";
import { NgxDropzoneModule } from "ngx-dropzone";
import { AdvancedTableModule } from "../users/advanced-table/advanced-table.module";
import { AdvancedRoutingModule } from "src/app/pages/tables/advanced/advanced-routing.module";



@NgModule({
  declarations: [
    CoursesComponent,
    MaterialsComponent,
    CategoriesComponent
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
  ]
})
export class AcademicsModule { }
