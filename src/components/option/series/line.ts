import { LineChart, LineSeriesOption } from 'echarts/charts';
import { use } from 'echarts/core';
import { withBaseOption } from '../base';

use(LineChart);
export const LineSeries = withBaseOption<LineSeriesOption>(
  'series',
  { type: 'line' },
  'LineSeries',
);
