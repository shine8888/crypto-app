import React from 'react';
import millify from 'millify';
import { Typography, Row, Col, Statistic } from 'antd';
import { useGetCryptosQuery } from '../../services/cryptoAPI';
import { Link } from 'react-router-dom';
import News from '../News/News';
import CryptoCurrencies from '../CryptoCurrencies/CryptoCurrencies';
import Loader from '../NavBar/Loader';
const { Title } = Typography;

const HomePage = () => {
  const { data, isFetching } = useGetCryptosQuery(10);
  const globalStats = data?.data?.stats;

  if (isFetching) return <Loader />;

  return (
    <>
      <Title level={2} className='heading'>
        Overall Market Status
      </Title>
      <Row>
        <Col span={12}>
          <Statistic title='Total Cryptocurrencies' value={globalStats?.total} />
        </Col>
        <Col span={12}>
          <Statistic
            title='Total Exchanges'
            value={millify(globalStats?.totalExchanges)}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title='Total Market Cap'
            value={millify(globalStats?.totalMarketCap)}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title='Total 24h Volume'
            value={millify(globalStats?.total24hVolume)}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title='Total Markets'
            value={millify(globalStats?.totalMarkets)}
          />
        </Col>
      </Row>
      <div className='home-heading-container'>
        <Title level={2} className='home-title'>
          Top 10 Cryptocurrencies in the world
        </Title>
        <Title level={3} className='show-more'>
          <Link to='/cryptocurrencies'>Show More</Link>
        </Title>
      </div>
      <CryptoCurrencies simplified />
      <div className='home-heading-container'>
        <Title level={2} className='home-title'>
          Lastest Crypto News
        </Title>
        <Title level={3} className='show-more'>
          <Link to='/news'>Show More</Link>
        </Title>
      </div>
      <News simplified />
    </>
  );
};

export default HomePage;
