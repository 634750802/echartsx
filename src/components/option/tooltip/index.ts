import { TooltipComponent, TooltipComponentOption } from 'echarts/components';
import { use } from 'echarts/core';
import { withBaseOption } from '../base';

use(TooltipComponent);
const Tooltip = withBaseOption<TooltipComponentOption>(
  'tooltip',
  {},
  'Tooltip',
);

export default Tooltip;
