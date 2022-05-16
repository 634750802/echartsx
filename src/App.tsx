import { useEffect, useState } from 'react';
import { Axis, BarSeries, Dataset, EChartsx, Grid, Legend, Once, Tooltip } from './index';

function App() {
  const [datasource, setDatasource] = useState([
    { name: 'first', v1: 2, v2: 5 },
    { name: 'second', v1: 6, v2: 1 },
    { name: 'third', v1: 1, v2: 3 },
  ]);

  useEffect(() => {
    const h = setInterval(() => {
      setDatasource(arr => arr.map(item => ({
        name: item.name,
        v1: Math.random(),
        v2: Math.random(),
      })));
    }, 1500);
    return () => {
      clearInterval(h);
    };
  }, []);

  return (
    <div className="App">
      <EChartsx init={{ width: 400, height: 400, renderer: 'canvas' }}>
        <BasicXY />
        <Dataset source={datasource} />
        <BarSeries name="s1" encode={{ x: 'name', y: 'v1' }} />
        <BarSeries name="s2" encode={{ x: 'name', y: 'v2' }} />
      </EChartsx>
    </div>
  );
}

const BasicXY = () => {
  return (
    <Once>
      <Grid containLabel />
      <Legend />
      <Axis.Category.X />
      <Axis.Value.Y />
      <Tooltip trigger="axis" />
    </Once>
  );
};

export default App;
