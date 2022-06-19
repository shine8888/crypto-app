import React, { useState, useEffect } from 'react';
import millify from 'millify';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Input, Select } from 'antd';
import Loader from '../NavBar/Loader';
import { useGetCryptosQuery } from '../../services/cryptoAPI';
import {
  SortAscendingOutlined,
  SortDescendingOutlined,
} from '@ant-design/icons';
import { LIST_SORT_VALUES } from '../../constants/trading.constants';

const CryptoCurrencies = ({ simplified }) => {
  const count = simplified ? 10 : 100;
  const { data: cryptoList, isFetching } = useGetCryptosQuery(count);

  // USESTATE
  const [cryptos, setcryptos] = useState(cryptoList?.data?.coins);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortableField, setSortableField] = useState('marketCap');
  const [sortableState, setSortableState] = useState(true);

  // USEEFFECT
  useEffect(() => {
    const filteredData = cryptoList?.data?.coins.filter((coin) =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setcryptos(filteredData);
  }, [cryptoList, searchTerm]);

  // Simple sortable frontend function
  const handleSort = ({ field, state }) => {
    field && setSortableField(field);
    state !== undefined && setSortableState(state);
    const sortableData = cryptos?.sort((a, b) => {
      if (state !== undefined ? state : sortableState)
        return a[field || sortableField] - b[field || sortableField];
      return b[field || sortableField] - a[field || sortableField];
    });
    setcryptos(sortableData);
  };

  if (isFetching) return <Loader />;

  return (
    <>
      {!simplified && (
        <div className="function--wrapper">
          <div className="sortable-container">
            <Select
              style={{ minWidth: 150 }}
              placeholder="Search sort field"
              onChange={(e) => {
                handleSort({ field: e });
              }}
              defaultValue={sortableField}
            >
              {Object.entries(LIST_SORT_VALUES).map(([key, value]) => (
                <Select.Option key={key} value={key}>
                  {value}
                </Select.Option>
              ))}
            </Select>
            <div
              onClick={() => handleSort({ state: !sortableState })}
              className="sort-button"
            >
              {sortableState ? (
                <SortAscendingOutlined style={{ color: '#fc0303' }} />
              ) : (
                <SortDescendingOutlined style={{ color: '#030ffc' }} />
              )}
            </div>
          </div>
          <div className="search-crypto">
            <Input
              placeholder="Search Cryptocurrency"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      )}
      <Row gutter={[32, 32]} className="crypto-card-container">
        {cryptos?.map((currency, index) => (
          <Col
            xs={24}
            sm={12}
            lg={6}
            className="crypto-card"
            key={currency.uuid}
          >
            <div>
              <Link to={`/crypto/${currency.uuid}`}>
                <Card
                  className="coin-card"
                  title={`${index + 1}. ${currency.name}`}
                  extra={
                    <img
                      className="crypto-image"
                      src={`${currency.iconUrl}`}
                      alt={currency.name}
                    />
                  }
                  hoverable
                >
                  <p>Price: {millify(Number(currency.price))}$</p>
                  <p>Market Cap: {millify(Number(currency.marketCap))}$</p>
                  <p>Daily Change: {millify(Number(currency.change))}%</p>
                </Card>
              </Link>
            </div>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default CryptoCurrencies;
