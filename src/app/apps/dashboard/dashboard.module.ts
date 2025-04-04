import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { NgChartsModule } from 'ng2-charts';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SimplebarAngularModule } from 'simplebar-angular';
import { WidgetModule } from 'src/app/shared/widget/widget.module';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';



@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,

    NgChartsModule,
    NgApexchartsModule,
    SimplebarAngularModule,
    WidgetModule,
    PageTitleModule,
  ]
})
export class DashboardModule { }
