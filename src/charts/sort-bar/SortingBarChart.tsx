import { TypedKey, useRealtime, UseRealtimeOptions } from '/src/charts/sort-bar/hook';
import { Axis, BarSeries, Grid, Legend, ScatterSeries, SingleAxis, Tooltip } from '/src/components/option';
import { EChartsx, Once } from '/src/index';
import { TransformComponent } from 'echarts/components';
import { use } from 'echarts/core';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CallbackDataParams } from 'echarts/types/dist/shared';
import React, { useCallback, useMemo } from 'react';

interface SortingBarChartProps<T, nameKey extends TypedKey<T, string>, timeKey extends TypedKey<T, string>> extends UseRealtimeOptions<T, nameKey, timeKey> {
  fields: UseRealtimeOptions<T, nameKey, timeKey>['fields'] & {
    value: string & keyof T
  };
  formatTime?: (date: unknown) => string;
}

use([TransformComponent, LabelLayout, UniversalTransition]);

export function SortingBarChart<T, nameKey extends TypedKey<T, string>, timeKey extends TypedKey<T, string>>({
  formatTime,
  ...opts
}: SortingBarChartProps<T, nameKey, timeKey>) {
  const { part: source, sortedNames, time } = useRealtime<T, nameKey, timeKey>(opts);
  const { max, min } = useMemo(() => {
    return opts.data.reduce((old, current) => {
      if ((current[opts.fields.time] as unknown as string) > old.max) {
        old.max = current[opts.fields.time] as unknown as string;
      }
      if ((current[opts.fields.time] as unknown as string) < old.min) {
        old.min = current[opts.fields.time] as unknown as string;
      }
      return old;
    }, { max: '', min: 'zzzzzzzzzzzzzzzzzzzzzzz' });
  }, [opts.data]);

  const timeLabelFormatter = useCallback((p: CallbackDataParams) => {
    return formatTime?.(p.value) ?? String(p.value);
  }, [formatTime]);

  return (
    <EChartsx
      init={{ width: 1000, height: 600, renderer: 'canvas' }}
      defaults={{
        animationDuration: 0,
        animationDurationUpdate: opts.interval,
        animationEasing: 'linear',
        animationEasingUpdate: 'linear',
      }}>
      <Once dependencies={opts.data}>
        <Grid containLabel left={0} />
        <Legend type="scroll" orient="horizontal" />
        <Axis.Value.X max="dataMax" axisLabel={{ showMaxLabel: false }} position="top"  />
        <Tooltip trigger="item" renderMode="html" />
        <SingleAxis type="time" min={min} max={max} bottom="5%" height="0" tooltip={{ show: false }} />
        <Axis.Category.Y animationDurationUpdate={opts.interval / 3}
                         animationDuration={0}
                         data={sortedNames as unknown[] as string[]} inverse max={10} />
      </Once>
      <ScatterSeries
        coordinateSystem="singleAxis"
        data={[{ value: time as unknown as string, id: 'time' }]}
        symbolSize={6}
        symbolOffset={-3}
        symbol='path://M,90,0,H,0,l,45,90,L,90,0,z'
        label={{ show: true, position: 'top', formatter: timeLabelFormatter }}
        emphasis={{ disabled: true }}
      />
      <BarSeries
        data={sortedNames.map(name => source[name as unknown as string]?.[opts.fields.value] ?? 0)}
        encode={{ x: opts.fields.value, y: opts.fields.name }}
        realtimeSort
        colorBy="data"
        label={{
          show: true,
          position: 'right',
          valueAnimation: true,
        }}
      />
    </EChartsx>
  );
}