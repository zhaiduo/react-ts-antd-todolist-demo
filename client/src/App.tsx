import React, { FC } from 'react';
import { Button } from 'antd';

import { DatePicker, TimePicker, Calendar } from './components';
// import format from 'dayjs';

import { useQuery, gql } from '@apollo/client';

import './App.less';

const EXCHANGE_RATES = gql`
  query GetExchangeRates {
    rates(currency: "USD") {
      currency
      rate
    }
  }
`;

const ExchangeRates: any = ()=> {
  const { loading, error, data } = useQuery(EXCHANGE_RATES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return data.rates.map((n: any) => (
    <div key={n.currency}>
      <p>
        {n.currency}: {n.rate}
      </p>
    </div>
  ));
}


const App: FC = () => {
  
  return (<div className="App">
  {/* <Button type="primary">Button</Button>
  <DatePicker />
  <TimePicker />
  <Calendar /> */}
  <ExchangeRates />
</div>);
};

export default App;