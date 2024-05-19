import { Component, Input, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-bar-chart-card',
  templateUrl: './bar-chart-card.component.html',
  styleUrls: ['./bar-chart-card.component.scss'],
})
export class BarChartCardComponent implements OnInit {
  @Input() barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Month'],
    datasets: [
      { data: [], label: 'Total income' },
      { data: [], label: 'Total expense' },
    ],
  };
  @Input() barChartOptions: ChartConfiguration<'bar'>['options'];
  @Input() barChartPlugins: any = [];
  @Input() barChartLegend: boolean = false;

  constructor() {}

  ngOnInit() {}
}
