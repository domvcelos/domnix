import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, Inject, NgZone, OnDestroy, PLATFORM_ID } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

import { IConsolidation, IConsolidationsFilters } from 'src/app/common/services/cashflow/cashflow.model';
import { CashflowService } from 'src/app/common/services/cashflow/cashflow.service';
import { Utils } from 'src/app/common/utils';


@Component({
  selector: 'app-chart-cash-flow',
  templateUrl: './chart-cash-flow.component.html',
  styleUrls: ['./chart-cash-flow.component.scss'],
})
export class ChartCashFlowComponent implements AfterViewInit, OnDestroy {
  chart: am4charts.XYChart;
  xAxis: am4charts.CategoryAxis<am4charts.AxisRenderer>;
  yAxis: am4charts.ValueAxis<am4charts.AxisRenderer>;
  chartIndicator: am4core.Container;
  chartindicatorInterval: any;
  spinner: am4core.Image;
  chartData: IConsolidation[] = [];
  range: FormGroup;
  startAmount = 0;
  endAmount = 0;
  date: {
    start: moment.Moment;
    end: moment.Moment;
  };

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private changeDetectorRef: ChangeDetectorRef,
    private cashflow: CashflowService,
    private zone: NgZone,
    private toastr: ToastrService,
    private utils: Utils,
  ) {
    const currentMonth = this.utils.currentMonthRange();
    this.date = { start: currentMonth[0], end: currentMonth[1] };
    this.range = new FormGroup({
      start: new FormControl(
        this.date.start.toDate(),
      ),
      end: new FormControl(
        this.date.end.toDate(),
      ),
    });
  }

  browserOnly(f: () => void): void {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  ngAfterViewInit(): void {
    this.handleChart();
  }

  checkPeriod(): void {
    const hasValue = this.range.controls['start'].value && this.range.controls['end'].value;
    const lowerThanThirth = moment.duration(
      moment(this.range.controls['end'].value).diff(
        moment(this.range.controls['start'].value)
      )
    ).asDays() + 1 <= 31;
    if (hasValue && lowerThanThirth) {
      this.generateChartData();
    } else if (hasValue && !lowerThanThirth) {
      this.toastr.error('A período deve ser igual ou menor a 30 dias');
    }
  }

  handleChart(): void {
    this.browserOnly(() => {
      am4core.useTheme(am4themes_animated);
      this.chart = am4core.create('chartdiv', am4charts.XYChart);
      this.chart.scrollbarX = new am4core.Scrollbar();
      this.chart.scrollbarX.marginBottom = 30;
      this.chart.legend = new am4charts.Legend();
      this.chart.legend.position = 'bottom';
      this.chart.legend.paddingBottom = 20;
      this.chart.legend.labels.template.maxWidth = 95;
      this.xAxis = this.chart.xAxes.push(new am4charts.CategoryAxis());
      this.xAxis.dataFields.category = 'category';
      this.xAxis.renderer.cellStartLocation = 0;
      this.xAxis.renderer.cellEndLocation = 0.8;
      this.xAxis.renderer.grid.template.location = 0;
      this.xAxis.renderer.minGridDistance = 2;
      this.xAxis.renderer.labels.template.rotation = -45;
      this.xAxis.renderer.labels.template.horizontalCenter = 'right';
      this.generateChartData();
      this.yAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
      this.createSeries('planned', 'Previsto');
      this.createSeries('performed', 'Realizado');
    });
  }

  generateChartData(): void {
    this.showChartIndicator();
    const filter: IConsolidationsFilters = {
      limit: 'disable',
      begin: moment(this.range.controls['start'].value).format('YYYY-MM-DD'),
      end: moment(this.range.controls['end'].value).format('YYYY-MM-DD'),
      ordering: 'when',
      status: 1,
    };

    this.cashflow.getConsolidations(filter).subscribe(
      CONSOLIDATIONS => {
        const timeValues: string[] = [];
        let minValue = 0;
        for (
          const forStart = moment(this.range.controls['start'].value);
          forStart.diff(this.range.controls['end'].value, 'days') <= 0;
          forStart.add(1, 'days')
        ) {
          timeValues.push(forStart.format('YYYY-MM-DD'));
        }
        this.chart.data = timeValues.map((time) => {
          return {
            category: moment(time).format('DD/MM'),
            performed: null,
            planned: null,
            date: time,
          };
        });
        this.chart.data.forEach((data) => {
          CONSOLIDATIONS.forEach((chart) => {
            if (moment(data.date).isSame(chart.when)) {
              minValue = minValue < chart.value ? minValue : chart.value;
              data.performed = chart.type === 1 ? chart.value : data.performed;
              data.planned = chart.type === 2 ? chart.value : data.planned;
            }
          });
        });
        if (CONSOLIDATIONS.length > 0) {
          this.startAmount = CONSOLIDATIONS[0].value;
          this.endAmount = CONSOLIDATIONS[CONSOLIDATIONS.length - 1].value;
        } else {
          this.startAmount = 0;
          this.endAmount = 0;
        }
        this.changeDetectorRef.detectChanges();
        this.yAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
        this.yAxis.min = minValue;
      },
      err => this.toastr.error('Não foi possível obter dados do fluxo de caixa.'),
    ).add(() => this.hideChartIndicator());
  }

  createSeries(value: string, name: string): void {
    const series = this.chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = value;
    series.dataFields.categoryX = 'category';
    series.columns.template.width = am4core.percent(100);
    series.name = name;
    if (name.match('Realizado')) {
      series.columns.template.fill = am4core.color('#A2CBFE'); // BLUE
      series.columns.template.stroke = am4core.color('#A2CBFE'); // BLUE
    } else {
      series.columns.template.fill = am4core.color('#4DE4B6'); // GREEN
      series.columns.template.stroke = am4core.color('#4DE4B6'); // GREEN
    }
    series.columns.template.adapter.add('fill', (fill: any, target: any) => {
      if (target.dataItem && (target.dataItem.valueY < 0)) {
        return am4core.color('#EB5757');
      }
      else {
        return fill;
      }
    });
    series.columns.template.adapter.add('stroke', (fill: any, target: any) => {
      if (target.dataItem && (target.dataItem.valueY < 0)) {
        return am4core.color('#EB5757');
      }
      else {
        return fill;
      }
    });
    const range = this.yAxis.createSeriesRange(series);
    range.value = 0;
    range.endValue = this.yAxis.min;
    series.events.on('shown', this.arrangeColumns, this);
    series.columns.template.tooltipText = `${name}: [bold]R$ {valueY}[/]\nData: [bold]{categoryX}[/]`;
  }

  arrangeColumns(): void {
    const series = this.chart.series.getIndex(0);
    const w = 1 - this.xAxis.renderer.cellStartLocation - (1 - this.xAxis.renderer.cellEndLocation);
    if (series.dataItems.length > 1) {
      const x0 = this.xAxis.getX(series.dataItems.getIndex(0), 'categoryX');
      const x1 = this.xAxis.getX(series.dataItems.getIndex(1), 'categoryX');
      const delta = ((x1 - x0) / this.chart.series.length) * w;
      if (am4core.isNumber(delta)) {
        const middle = this.chart.series.length / 2;
        let newIndex = 0;
        this.chart.series.each((chartSeries) => {
          if (!chartSeries.isHidden && !chartSeries.isHiding) {
            chartSeries.dummyData = newIndex;
            newIndex++;
          } else {
            chartSeries.dummyData = this.chart.series.indexOf(chartSeries);
          }
        });
        const visibleCount = newIndex;
        const newMiddle = visibleCount / 2;
        this.chart.series.each((chartSeries) => {
          const trueIndex = this.chart.series.indexOf(chartSeries);
          const index = chartSeries.dummyData;
          const dx = (index - trueIndex + middle - newMiddle) * delta;
          chartSeries.animate(
            { property: 'dx', to: dx },
            chartSeries.interpolationDuration,
            chartSeries.interpolationEasing
          );
          chartSeries.bulletsContainer.animate(
            { property: 'dx', to: dx },
            chartSeries.interpolationDuration,
            chartSeries.interpolationEasing
          );
        });
      }
    }
  }

  showChartIndicator(): void {
    if (!this.chartIndicator) {
      this.chartIndicator = this.chart.tooltipContainer.createChild(am4core.Container);
      this.chartIndicator.background.fill = am4core.color('#fff');
      this.chartIndicator.background.fillOpacity = 0.8;
      this.chartIndicator.width = am4core.percent(100);
      this.chartIndicator.height = am4core.percent(100);
      const indicatorLabel = this.chartIndicator.createChild(am4core.Label);
      indicatorLabel.text = 'Carregando dados...';
      indicatorLabel.align = 'center';
      indicatorLabel.valign = 'middle';
      indicatorLabel.fill = am4core.color('#4de4b6'); // GREEN
      indicatorLabel.fontSize = 20;
      indicatorLabel.dy = 50;
      this.spinner = this.chartIndicator.createChild(am4core.Image);
      this.spinner.href = '../../../assets/spinner.gif';
      this.spinner.align = 'center';
      this.spinner.valign = 'middle';
      this.spinner.horizontalCenter = 'middle';
      this.spinner.verticalCenter = 'middle';
      this.spinner.scale = 0.7;
    }
    this.chartIndicator.hide(0);
    this.chartIndicator.show();
    clearInterval(this.chartindicatorInterval);
    this.chartindicatorInterval = setInterval(() => {
      this.spinner.animate(
        [
          {
            from: 0,
            to: 360,
            property: 'rotation',
          },
        ],
        2000
      );
    }, 3000);
  }

  hideChartIndicator(): void {
    this.chartIndicator.hide();
    clearInterval(this.chartindicatorInterval);
  }

  ngOnDestroy(): void {
    this.browserOnly(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }

  getConsolidations(): void {
    const filter: IConsolidationsFilters = {
      limit: 'disable',
      begin: moment(this.range.controls['start'].value).format('YYYY-MM-DD'),
      end: moment(this.range.controls['end'].value).format('YYYY-MM-DD'),
      ordering: 'when',
      status: 1,
    };
    this.cashflow.getConsolidations(filter).subscribe(
      CONSOLIDATIONS => this.chartData = CONSOLIDATIONS,
    );
  }

}
