import { withBaseOption } from '../base';
import { GridComponent, GridComponentOption } from 'echarts/components';
import { use } from 'echarts/core';

use(GridComponent);
export const Grid = withBaseOption<GridComponentOption>(
  'grid',
  undefined,
  'Grid',
);
