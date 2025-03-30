import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UserListComponent } from "./user-list/user-list.component";
import { UserCoursesComponent } from "./user-courses/user-courses.component";
import { UsersRoutingModule } from "./users-routing.module";
import { FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { PageTitleModule } from "src/app/shared/page-title/page-title.module";
import { AdvancedTableModule } from "./advanced-table/advanced-table.module";
import { AdvancedRoutingModule } from "src/app/pages/tables/advanced/advanced-routing.module";

@NgModule({
  declarations: [UserListComponent, UserCoursesComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    PageTitleModule,
    AdvancedTableModule,
    AdvancedRoutingModule,
  ],
})
export class UsersModule {}
