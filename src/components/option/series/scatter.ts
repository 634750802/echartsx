import { ScatterChart, ScatterSeriesOption } from 'echarts/charts';
import { use } from 'echarts/core';
import { withBaseOption } from '../base';

use(ScatterChart)

export const ScatterSeries = withBaseOption<ScatterSeriesOption>('series', { type: 'scatter' }, 'Scatter')
