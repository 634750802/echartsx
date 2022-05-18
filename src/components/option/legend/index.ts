import { LegendComponent, LegendComponentOption } from 'echarts/components';
import { use } from 'echarts/core';
import { withBaseOption } from '../base';

use(LegendComponent);
const Legend = withBaseOption<LegendComponentOption>(
  'legend',
  {},
  'Legend',
);

export default Legend;
