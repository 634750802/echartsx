import { LineChart, RankChart, SortingBarChart, Title } from './index';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import rankData from './rank-data.json';
import sortData from './sort-data.json';
import { useFPS } from './utils/useFPS';

const dft = new Intl.DateTimeFormat(['en-US'], {
  month: 'short',
  year: 'numeric',
});

const format = (val: unknown): string => {
  const date = new Date(val as any);

  return `${dft.format(date)}`;
};

use(CanvasRenderer);

function App() {
  const fps = useFPS(1000)
  return (
    <div className="App">
      <p>
        {fps}
      </p>
      <LineChart height={360} width={480} fields={{ name: 'repo_name', time: 'event_month', value: 'total'  }} data={sortData} formatTime={format} >
        <Title text='title' textAlign='center' left='50%' />
      </LineChart>
      <div style={{ maxWidth: 1200 }}>
        <SortingBarChart height={15 * 36 + 128} fields={{ name: 'repo_name', time: 'event_month', value: 'total' }} data={sortData}
                         interval={400} formatTime={format} max={15} >
          <Title text='title' textAlign='center' left='50%' />
        </SortingBarChart>
      </div>
      <RankChart height={30 * 36 + 128} data={rankData} fields={{ name: 'repo_name', time: 'event_year', value: 'total', rank: 'rank' }} >
        <Title text='title' textAlign='center' left='50%' />
      </RankChart>
    </div>
  );
}

export default App;
