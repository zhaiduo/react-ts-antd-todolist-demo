import React, { FC } from 'react';
import { Button } from 'antd';
import ExchangeRates from "./components/ExchangeRates"

// import { DatePicker, TimePicker, Calendar } from './components';
// import format from 'dayjs';

import './App.less';

const App: FC = () => {
  
  return (<div className="App">
    <Button type="primary">learn react</Button>
  {/* 
  <DatePicker />
  <TimePicker />
  <Calendar /> */}
  <ExchangeRates />
</div>);
};

export default App;