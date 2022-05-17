import { TypedKey } from '/src/charts/sort-bar/hook';
import { Once } from '/src/components/controls';
import { Axis, Dataset, Grid, LineSeries, Tooltip } from '/src/components/option';
import { TransformComponent } from 'echarts/components';
import { use } from 'echarts/core';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { EChartsType } from 'echarts/types/dist/shared';
import React, { ForwardedRef, forwardRef, useCallback, useMemo } from 'react';
import EChartsx, { EChartsInitOptions } from '../../components/EChartsx';

export interface RankChartProps<T> extends EChartsInitOptions {
  data: T[];
  fields: {
    name: TypedKey<T, string>
    time: TypedKey<T, string | number>
    value: TypedKey<T, number>
    rank: TypedKey<T, number>
  };
}

use([TransformComponent, LabelLayout, UniversalTransition]);

function RankChart<T>({ data, fields, ...opts }: RankChartProps<T>, ref: ForwardedRef<EChartsType>) {
  const repos = useMemo(() => data.reduce((set, item) => {
    set.add(item[fields.name] as any);
    return set;
  }, new Set<string>()), [data, fields.name]);

  return (
    <EChartsx init={{ renderer: 'canvas', ...opts }} ref={ref} defaults={{
      animationDuration: 3000,
      animationDurationUpdate :3000
    }}>
      <Once dependencies={[data]}>
        <Grid containLabel />
        <Axis.Value.Y minInterval={1} min={1} inverse show={false} />
        <Axis.Time.X axisLabel={{ formatter: (p: string | number) => String(p), showMaxLabel: true }} minInterval={1}
                     maxInterval={1}
                     position="top" splitLine={{ show: true }} offset={32} axisLine={{ show: false }}
                     axisTick={{ show: false }}
        />
        <Tooltip trigger="item" />
      </Once>
      <Dataset id="original" source={data} />
      {[...repos].map((repo) => (
        <Dataset id={repo} key={repo} transform={{ type: 'filter', config: { value: repo, dimension: fields.name } }} />
      ))}
      {[...repos].map((repo) => (
        <LineSeries key={repo} name={repo} datasetId={repo} encode={{ x: fields.time, y: fields.rank }} smooth
                    symbolSize={28}
                    lineStyle={{
                      width: 3,
                    }}
                    endLabel={{
                      show: true,
                      formatter: repo,
                      offset: [12, 0],
                    }}
                    label={{
                      show: true,
                      position: 'inside',
                      formatter: p => {
                        return String((p.value as T)[fields.value]);
                      },
                      fontSize: 8,
                    }}
                    emphasis={{ focus: 'series', label: { fontSize: 10 } }}
        />
      ))}
    </EChartsx>
  );
}

export default forwardRef(RankChart);