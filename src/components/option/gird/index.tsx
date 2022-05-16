import { withBaseOption } from '/src/components/option';
import { GridComponent, GridComponentOption } from 'echarts/components';
import { use } from 'echarts/core';

use(GridComponent);
export const Grid = withBaseOption<GridComponentOption>(
  'grid',
  undefined,
  'Grid',
);
