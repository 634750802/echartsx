import { TransformComponent } from 'echarts/components';
import { use } from 'echarts/core';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CallbackDataParams, EChartsType } from 'echarts/types/dist/shared';
import { ForwardedRef, forwardRef, PropsWithChildren, useCallback, useMemo } from 'react';
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
} from '../../components/option';
import { EChartsInitOptions, EChartsx, If, Once } from '../../index';
import { withEChartsRecorder } from '../../utils/useEChartsRecorder';
import RealtimeSeries from './DynamicSeries';
import { TypedKey, UseRealtimeOptions } from './hook';

use([TransformComponent, LabelLayout, UniversalTransition]);

export interface SortingBarChartProps<T, nameKey extends TypedKey<T, string>, timeKey extends TypedKey<T, string>> extends Omit<UseRealtimeOptions<T, nameKey, timeKey>, 'onStart' | 'onStop'>, EChartsInitOptions {
  formatTime?: (date: unknown) => string;
  theme?: string;
  max?: number
}

function SortingBarChart<T, nameKey extends TypedKey<T, string>, timeKey extends TypedKey<T, string>>({
  formatTime,
  fields,
  data,
  interval,
  children,
  theme,
  max: maxCount = 10,
  ...opts
}: PropsWithChildren<SortingBarChartProps<T, nameKey, timeKey>>, forwardedRef: ForwardedRef<EChartsType>) {
  const { ref, recording, download, start, stop } = withEChartsRecorder(forwardedRef);

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
      theme={theme}
      init={{ renderer: 'canvas', ...opts }}
      defaults={{
        animationDuration: 0,
        animationDurationUpdate: interval,
        animationEasing: 'linear',
        animationEasingUpdate: 'linear',
      }}
      ref={ref}
    >
      <Once dependencies={[min, max]}>
        <Grid containLabel={false} left={96} top={48} bottom={48} right={48} />
        <Legend type="scroll" orient="horizontal" />
        <Axis.Value.X max="dataMax" axisLabel={{ showMaxLabel: false }} position="top" />
        <Tooltip trigger="item" renderMode="html" />
      </Once>
      <Once dependencies={[min, max]}>
        <SingleAxis type="time" min={min} max={max} bottom="24" axisLabel={{ inside: true }} axisTick={{ show: false }}
                    height="0" tooltip={{ show: false }} />
      </Once>
      <Once dependencies={[timeLabelFormatter, fields.name, fields.value]}>
        <ScatterSeries
          id="time"
          coordinateSystem="singleAxis"
          symbolSize={6}
          symbolOffset={3}
          symbolRotate={180}
          symbol="path://M,90,0,H,0,l,45,90,L,90,0,z"
          label={{ show: true, position: 'bottom', formatter: timeLabelFormatter }}
          emphasis={{ disabled: true }}
        />
        <BarSeries
          id="bars"
          encode={{ x: fields.value, y: fields.name }}
          realtimeSort
          seriesLayoutBy='column'
          colorBy="data"
          barMaxWidth={45}
          label={{
            show: true,
            position: 'right',
            valueAnimation: true,
          }}
        />
      </Once>
      <If cond={!recording} once then={() => <Toolbox feature={{ myDownload: myDownload(download) }} />} />
      <RealtimeSeries interval={interval} fields={fields} data={data} onStart={start} onStop={stop} max={maxCount} />
      {children}
    </EChartsx>
  );
}

export default forwardRef(SortingBarChart);
