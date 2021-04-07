import { useQuery, gql } from "@apollo/client";

export const EXCHANGE_RATES = gql`
  query GetExchangeRates {
    rates(currency: "USD") {
      currency
      rate
    }
  }
`;

const ExchangeRates: any = () => {
  const { loading, error, data } = useQuery(EXCHANGE_RATES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return data.rates.map((n: any) => (
    <div key={n.currency}>
      <p className="sub">
        {n.currency}:{n.rate}
      </p>
    </div>
  ));
};

export default ExchangeRates;
