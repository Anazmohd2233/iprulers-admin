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
  NgbProgressbarModule,
  NgbTooltipModule,
} from "@ng-bootstrap/ng-bootstrap";
import { NgApexchartsModule } from "ng-apexcharts";
import { Select2Module } from "ng-select2-component";
import { SimplebarAngularModule } from "simplebar-angular";
import { WidgetModule } from "src/app/shared/widget/widget.module";
import { NgxDropzoneModule } from "ngx-dropzone";

@NgModule({
  declarations: [StudentsComponent],
  imports: [
    CommonModule,
    StudentsRoutingModule,
    PageTitleModule,
    AdvancedTableModule,
    AdvancedRoutingModule,
  ],
})
export class StudentsModule {}
