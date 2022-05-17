import { SortingBarChart } from '/src/charts/sort-bar';
import React from 'react';
import data from './sort-data.json';

const dft = new Intl.DateTimeFormat(['en-US'], {
  month: 'short',
  year: 'numeric'
})

const format = (val: unknown): string => {
  const date = new Date(val as any)

  return `${dft.format(date)}`
}

function App() {
  return (
    <div className="App">
      <SortingBarChart fields={{ name: 'repo_name', time: 'event_month', value: 'total' }} data={data}
                       interval={1000} formatTime={format} />
    </div>
  );
}

export default App;
