import { TypedKey } from '/src/charts/sort-bar/hook';
import Axis from '/src/components/option/axis';
import { Dataset, EChartsInitOptions, EChartsx, Grid, LineSeries, Once, Tooltip } from '/src/index';
import { EChartsType } from 'echarts/types/dist/shared';
import { ForwardedRef, forwardRef, Fragment, PropsWithChildren, useMemo } from 'react';


export interface LineChartProps<T> extends EChartsInitOptions {
  data: T[];
  fields: {
    name: TypedKey<T, string>
    time: TypedKey<T, string>
    value: TypedKey<T, number>
  };
}

function useNames<T>(data: T[], nameField: TypedKey<T, string>): string[] {
  return useMemo(() => {
    const set = new Set<string>();
    data.forEach(item => set.add(item[nameField] as unknown as string));
    return [...set].sort();
  }, [data, nameField]);
}

function LineChart<T>({
  data,
  fields,
  children,
  ...init
}: PropsWithChildren<LineChartProps<T>>, ref: ForwardedRef<EChartsType>) {
  const names = useNames(data, fields.name);

  return (
    <EChartsx ref={ref} init={init} debug>
      <Once dependencies={names}>
        <Grid containLabel left={8} right={8} top={32} bottom={8} />
        <Axis.Time.X />
        <Axis.Value.Y />
        <Tooltip trigger="axis" axisPointer={{ type: 'cross' }} renderMode="html" confine />
        {names.map((name) => (
          <Fragment key={name}>
            <Dataset id={name} fromDatasetId="original"
                     transform={{ type: 'filter', config: { value: name, dimension: fields.name } }} />
            <LineSeries datasetId={name} name={name} encode={{ x: fields.time, y: fields.value }} showSymbol={false}
                        smooth emphasis={{ focus: 'series' }} />
          </Fragment>
        ))}
      </Once>
      <Dataset id="original" source={data} />
      {children}
    </EChartsx>
  );
}

export default forwardRef(LineChart);
