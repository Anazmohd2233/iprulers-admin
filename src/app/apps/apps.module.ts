import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AppsRoutingModule } from "./apps-routing.module";
import { NgbdToastGlobal } from "./toaster/toast-global.component";
import { ToastsContainer } from "./toaster/toasts-container.component";
import { NgbToastModule } from "@ng-bootstrap/ng-bootstrap";
import { NgbdToastGlobalModule } from "./toaster/toast-global.module";

@NgModule({
  declarations: [],
  imports: [CommonModule, AppsRoutingModule,
     NgbToastModule,NgbdToastGlobalModule
    ],

})
export class AppsModule {}
