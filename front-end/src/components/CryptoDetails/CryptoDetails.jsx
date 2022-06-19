import React, { useState } from 'react';
import HTMLReactParser from 'html-react-parser';
import { useParams } from 'react-router-dom';
import millify from 'millify';
import { Row, Col, Typography, Select } from 'antd';
import {
  MoneyCollectOutlined,
  DollarCircleOutlined,
  FundOutlined,
  ExclamationCircleOutlined,
  StopOutlined,
  TrophyOutlined,
  CheckOutlined,
  NumberOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';

import {
  useGetCryptoDetailsQuery,
  useGetCryptoHistoryQuery,
} from '../../services/cryptoAPI';
import LineChart from '../Chart/LineChart';
import Loader from '../NavBar/Loader';

const { Title, Text } = Typography;
const { Option } = Select;

const CryptoDetails = () => {
  const { coinId } = useParams();
  const [timePeriod, settimePeriod] = useState('7d');
  const { data, isFetching } = useGetCryptoDetailsQuery(coinId);
  const { data: coinHistory } = useGetCryptoHistoryQuery({
    coinId,
    timePeriod,
  });

  const cryptoDetails = data?.data?.coin;
  const time = ['3h', '24h', '7d', '30d', '3m', '1y', '5y'];
  if (isFetching) return <Loader />;
  const stats = [
    { title: 'Rank', value: cryptoDetails.rank, icon: <NumberOutlined /> },
    {
      title: 'Price to USD',
      value: `$ ${cryptoDetails.price && millify(cryptoDetails.price)}`,
      icon: <DollarCircleOutlined />,
    },
    {
      title: '24h Volume',
      value: `$ ${cryptoDetails.volume && millify(cryptoDetails.volume)}`,
      icon: <ThunderboltOutlined />,
    },
    {
      title: 'Market Cap',
      value: `$ ${cryptoDetails.marketCap && millify(cryptoDetails.marketCap)}`,
      icon: <DollarCircleOutlined />,
    },
    {
      title: 'All-time-high(daily avg.)',
      value: `$ ${millify(cryptoDetails.allTimeHigh.price)}`,
      icon: <TrophyOutlined />,
    },
  ];

  const genericStats = [
    {
      title: 'Number Of Markets',
      value: cryptoDetails.numberOfMarkets,
      icon: <FundOutlined />,
    },
    {
      title: 'Number Of Exchanges',
      value: cryptoDetails.numberOfExchanges,
      icon: <MoneyCollectOutlined />,
    },
    {
      title: 'Aprroved Supply',
      value: cryptoDetails.approvedSupply ? (
        <CheckOutlined />
      ) : (
        <StopOutlined />
      ),
      icon: <ExclamationCircleOutlined />,
    },
    {
      title: 'Total Supply',
      value: `$ ${millify(Number(cryptoDetails.supply.total))}`,
      icon: <ExclamationCircleOutlined />,
    },
    {
      title: 'Circulating Supply',
      value: `${cryptoDetails.circulatingSupply
        ? millify(cryptoDetails.circulatingSupply)
        : '-'
        }`,
      icon: <ExclamationCircleOutlined />,
    },
  ];
  return (
    <Col className='coin-detail-container'>
      <Col className='coin-heading-container'>
        <Title level={2} className='coin-name'>
          {cryptoDetails.name} ({cryptoDetails.symbol}) Price
        </Title>
        <p>
          {cryptoDetails.name} live price in US dollars. View value statistic,
          market cap and supply.
        </p>
      </Col>
      <Select
        defaultValue='7d'
        className='select-timeperiod'
        placeholder='Select Time Period'
        onChange={(value) => settimePeriod(value)}
      >
        {time.map((date) => (
          <Option value={date}>{date}</Option>
        ))}
      </Select>
      <LineChart
        coinHistory={coinHistory}
        currentPrice={millify(cryptoDetails.price)}
        coinName={cryptoDetails.name}
      />

      <Col className='stats-container'>
        <Col className='coin-value-statistic'>
          <Col className='coin-value-statistics-heading'>
            <Title level={3} className='coin-detailes-heading'>
              {cryptoDetails.name} Value Statistic
            </Title>
            <p>An overview showing the statistic of {cryptoDetails.name}</p>
          </Col>
          {stats.map(({ icon, title, value }) => (
            <Col className='coin-stats'>
              <Col className='coin-stats-name'>
                <Text>{icon}</Text>
                <Text>{title}</Text>
              </Col>
              <Text className='stats'>{value}</Text>
            </Col>
          ))}
        </Col>

        <Col className='other-stats-info'>
          <Col className='coin-value-statistics-heading'>
            <Title level={3} className='coin-details-heading'>
              Other Statistic
            </Title>
            <p>An overview showing the statistic of all cryptocurrencies</p>
          </Col>
          {genericStats.map(({ icon, title, value }) => (
            <Col className='coin-stats'>
              <Col className='coin-stats-name'>
                <Text>{icon}</Text>
                <Text>{title}</Text>
              </Col>
              <Text className='stats'>{value}</Text>
            </Col>
          ))}
        </Col>
      </Col>
      <Col className='coin-desc-link'>
        <Row className='coin-desc'>
          <Title level={3} className='coin-details-heading'>
            What is {cryptoDetails.name} is?
            {HTMLReactParser(cryptoDetails.description)}
          </Title>
        </Row>
        <Col className='coin-links'>
          <Title level={3} className='coin-details-heading'>
            {cryptoDetails.name} Links
          </Title>
          {cryptoDetails.links.map((link) => (
            <Row className='coin-link' key={link.name}>
              <Title className='link-name' level={5}>
                {link.type}
              </Title>
              <a href={link.url} target='_blank' rel='noreferrer'>
                {link.name}
              </a>
            </Row>
          ))}
        </Col>
      </Col>
    </Col>
  );
};

export default CryptoDetails;
