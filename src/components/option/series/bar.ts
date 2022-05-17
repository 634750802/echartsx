import { BarChart, BarSeriesOption } from 'echarts/charts';
import { use } from 'echarts/core';
import { withBaseOption } from '../base';

use(BarChart);
export const BarSeries = withBaseOption<BarSeriesOption>(
  'series',
  { type: 'bar' },
  'BarSeries',
);
