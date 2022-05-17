import { withBaseOption } from '../base';
import { SingleAxisComponent, SingleAxisComponentOption } from 'echarts/components';
import { use } from 'echarts/core';

use(SingleAxisComponent)

export const SingleAxis = withBaseOption<SingleAxisComponentOption>('singleAxis', {}, 'SingleAxis')
