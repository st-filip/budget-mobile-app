import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportsPageRoutingModule } from './reports-routing.module';

import { ReportsPage } from './reports.page';
import { BaseChartDirective } from 'ng2-charts';
import { BarChartCardComponent } from './bar-chart-card/bar-chart-card.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportsPageRoutingModule,
    BaseChartDirective,
  ],
  declarations: [ReportsPage, BarChartCardComponent],
})
export class ReportsPageModule {}
