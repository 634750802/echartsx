import { withBaseOption } from '/src/components/option';
import { TooltipComponent, TooltipComponentOption } from 'echarts/components';
import { use } from 'echarts/core';

use(TooltipComponent);
const Tooltip = withBaseOption<TooltipComponentOption>(
  'tooltip',
  {},
  'Tooltip',
);

export default Tooltip;
