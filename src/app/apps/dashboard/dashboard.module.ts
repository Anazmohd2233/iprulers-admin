import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { NgChartsModule } from 'ng2-charts';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SimplebarAngularModule } from 'simplebar-angular';
import { WidgetModule } from 'src/app/shared/widget/widget.module';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { NgbdToastGlobal } from '../toaster/toast-global.component';
import { ToastsContainer } from '../toaster/toasts-container.component';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbdToastGlobalModule } from '../toaster/toast-global.module';



@NgModule({
  declarations: [
    DashboardComponent,
    // NgbdToastGlobal,
    // ToastsContainer
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NgChartsModule,
    NgApexchartsModule,
    SimplebarAngularModule,
    WidgetModule,
    PageTitleModule,
    // NgbToastModule,
    NgbdToastGlobalModule

    
  ]
})
export class DashboardModule { }
