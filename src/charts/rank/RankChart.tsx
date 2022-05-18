import { TransformComponent } from 'echarts/components';
import { use } from 'echarts/core';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { EChartsType } from 'echarts/types/dist/shared';
import { ForwardedRef, forwardRef, Fragment, PropsWithChildren, useMemo } from 'react';
import { Once } from '../../components/controls';
import EChartsx, { EChartsInitOptions } from '../../components/EChartsx';
import { Axis, Dataset, Grid, LineSeries, Tooltip } from '../../components/option';
import { TypedKey } from '../sort-bar/hook';

export interface RankChartProps<T> extends EChartsInitOptions {
  data: T[];
  fields: {
    name: TypedKey<T, string>
    time: TypedKey<T, string | number>
    value: TypedKey<T, number>
    rank: TypedKey<T, number>
  };
  theme?: string
}

use([TransformComponent, LabelLayout, UniversalTransition]);

function RankChart<T>({
  data,
  fields,
  children,
  theme,
  ...opts
}: PropsWithChildren<RankChartProps<T>>, ref: ForwardedRef<EChartsType>) {
  const repos = useMemo(() => {
    const set = new Set<string>();
    data.forEach((item) => {
      set.add(item[fields.name] as any);
    });
    return [...set];
  }, [data, fields.name]);

  return (
    <EChartsx theme={theme} init={{ renderer: 'canvas', ...opts }} ref={ref} defaults={{
      animationDuration: 3000,
      animationDurationUpdate: 3000,
    }}>
      <Once>
        <Grid containLabel top={64} />
        <Axis.Value.Y minInterval={1} min={1} inverse show={false} />
        <Axis.Time.X axisLabel={{ formatter: (p: string | number) => String(p), showMaxLabel: true }} minInterval={1}
                     maxInterval={1}
                     position="top" splitLine={{ show: true }} offset={28} axisLine={{ show: false }}
                     axisTick={{ show: false }}
        />
        <Tooltip trigger="item" />
      </Once>
      <Once dependencies={repos}>
        {repos.map((repo) => (
          <Fragment key={repo}>
            <Dataset id={repo} fromDatasetId="original"
                     transform={{ type: 'filter', config: { value: repo, dimension: fields.name } }} />
            <LineSeries name={repo} datasetId={repo} encode={{ x: fields.time, y: fields.rank }} smooth
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
          </Fragment>
        ))}
      </Once>
      <Dataset id="original" source={data} />
      {children}
    </EChartsx>
  );
}

export default forwardRef(RankChart);