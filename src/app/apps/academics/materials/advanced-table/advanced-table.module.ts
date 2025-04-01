import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

// directive
import { NgbSortableHeaderDirective } from "./sortable.directive";

// components
import { AdvancedTableComponent } from "./advanced-table.component";
import { NgxDropzoneModule } from "ngx-dropzone";

@NgModule({
  declarations: [NgbSortableHeaderDirective, AdvancedTableComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    NgxDropzoneModule,
  ],
  exports: [AdvancedTableComponent],
})
export class AdvancedTableModule {}
