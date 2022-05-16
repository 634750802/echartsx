import { withBaseOption } from '/src/components/option';
import { LegendComponent, LegendComponentOption } from 'echarts/components';
import { use } from 'echarts/core';

use(LegendComponent);
const Legend = withBaseOption<LegendComponentOption>(
  'legend',
  {},
  'Legend',
);

export default Legend;
