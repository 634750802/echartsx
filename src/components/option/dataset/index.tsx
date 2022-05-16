import { DatasetComponent, DatasetComponentOption } from 'echarts/components';
import { use } from 'echarts/core';
import { withBaseOption } from '../base';

use(DatasetComponent);
export const Dataset = withBaseOption<DatasetComponentOption>(
  'dataset',
  {},
  'Dataset',
);