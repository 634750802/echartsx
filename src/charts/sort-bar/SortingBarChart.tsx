import { TypedKey, useRealtime, UseRealtimeOptions } from '/src/charts/sort-bar/hook';
import {
  Axis,
  BarSeries,
  Grid,
  Legend,
  myDownload,
  ScatterSeries,
  SingleAxis,
  Toolbox,
  Tooltip,
} from '/src/components/option';
import { EChartsInitOptions, EChartsx, Once } from '/src/index';
import { withEChartsRecorder } from '/src/utils/useEChartsRecorder';
import { TransformComponent } from 'echarts/components';
import { use } from 'echarts/core';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CallbackDataParams, EChartsType } from 'echarts/types/dist/shared';
import React, { ForwardedRef, forwardRef, PropsWithChildren, useCallback, useMemo } from 'react';

use([TransformComponent, LabelLayout, UniversalTransition]);

export interface SortingBarChartProps<T, nameKey extends TypedKey<T, string>, timeKey extends TypedKey<T, string>> extends Omit<UseRealtimeOptions<T, nameKey, timeKey>, 'onStart' | 'onStop'>, EChartsInitOptions {
  fields: UseRealtimeOptions<T, nameKey, timeKey>['fields'] & {
    value: string & keyof T
  };
  formatTime?: (date: unknown) => string;
}

function SortingBarChart<T, nameKey extends TypedKey<T, string>, timeKey extends TypedKey<T, string>>({
  formatTime,
  fields,
  data,
  interval,
  children,
  ...opts
}: PropsWithChildren<SortingBarChartProps<T, nameKey, timeKey>>, forwardedRef: ForwardedRef<EChartsType>) {
  const { ref, recording, download, start, stop } = withEChartsRecorder(forwardedRef);

  const { part: source, sortedNames, time } = useRealtime<T, nameKey, timeKey>({
    fields,
    data,
    interval,
    onStart: start,
    onStop: stop,
  });
  const { max, min } = useMemo(() => {
    return data.reduce((old, current) => {
      if ((current[fields.time] as unknown as string) > old.max) {
        old.max = current[fields.time] as unknown as string;
      }
      if ((current[fields.time] as unknown as string) < old.min) {
        old.min = current[fields.time] as unknown as string;
      }
      return old;
    }, { max: '', min: 'zzzzzzzzzzzzzzzzzzzzzzz' });
  }, [data]);

  const timeLabelFormatter = useCallback((p: CallbackDataParams) => {
    return formatTime?.(p.value) ?? String(p.value);
  }, [formatTime]);

  return (
    <EChartsx
      init={{ renderer: 'canvas', ...opts }}
      defaults={{
        animationDuration: 0,
        animationDurationUpdate: interval,
        animationEasing: 'linear',
        animationEasingUpdate: 'linear',
      }}
      ref={ref}
    >
      <Once dependencies={[min, max, sortedNames]}>
        <Grid containLabel left={8} top={32} bottom={48} right={48} />
        <Legend type="scroll" orient="horizontal" />
        <Axis.Value.X max="dataMax" axisLabel={{ showMaxLabel: false }} position="top" />
        <Tooltip trigger="item" renderMode="html" />
      </Once>
      <Once dependencies={[min, max]}>
        <SingleAxis type="time" min={min} max={max} bottom="24" axisLabel={{ inside: true }} axisTick={{ show: false }}
                    height="0" tooltip={{ show: false }} />
      </Once>
      <Once dependencies={sortedNames}>
        <Axis.Category.Y animationDurationUpdate={interval}
                         animationDuration={interval / 3}
                         animationEasing='linear'
                         animationEasingUpdate='linear'
                         data={sortedNames as unknown[] as string[]} inverse max={10} />
      </Once>
      {recording ? undefined : <Toolbox feature={{ myDownload: myDownload(download) }} />}
      <ScatterSeries
        coordinateSystem="singleAxis"
        data={[{ value: time as unknown as string, id: 'time' }]}
        symbolSize={6}
        symbolOffset={3}
        symbolRotate={180}
        symbol="path://M,90,0,H,0,l,45,90,L,90,0,z"
        label={{ show: true, position: 'bottom', formatter: timeLabelFormatter }}
        emphasis={{ disabled: true }}
      />
      <BarSeries
        data={sortedNames.map(name => source[name as unknown as string]?.[fields.value] ?? 0)}
        encode={{ x: fields.value, y: fields.name }}
        realtimeSort
        colorBy="data"
        label={{
          show: true,
          position: 'right',
          valueAnimation: true,
        }}
      />
      {children}
    </EChartsx>
  );
}

export default forwardRef(SortingBarChart);
