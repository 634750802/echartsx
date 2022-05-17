import { TitleComponent, TitleComponentOption } from 'echarts/components';
import { use } from 'echarts/core';
import { withBaseOption } from '../base';

use(TitleComponent);

export const Title = withBaseOption<TitleComponentOption>('title', {}, 'Title');
