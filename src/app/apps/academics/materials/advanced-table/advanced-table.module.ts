import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

// directive
import { NgbSortableHeaderDirective } from "./sortable.directive";

// components
import { AdvancedTableComponent } from "./advanced-table.component";
import { NgxDropzoneModule } from "ngx-dropzone";
import { Select2Module } from "ng-select2-component";

@NgModule({
  declarations: [NgbSortableHeaderDirective, AdvancedTableComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    NgxDropzoneModule,
    Select2Module
  ],
  exports: [AdvancedTableComponent],
})
export class AdvancedTableModule {}
