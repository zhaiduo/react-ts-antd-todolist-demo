import React, { FC } from 'react';
import { Button } from 'antd';

import { DatePicker, TimePicker, Calendar } from './components';
import format from 'dayjs';

import './App.less';

const App: FC = () => (
  <div className="App">
    <Button type="primary">Button</Button>
    <DatePicker />
    <TimePicker />
    <Calendar />
  </div>
);

export default App;