import React, { useState } from 'react';
import { Row, Col, Card, Avatar, Select, Typography } from 'antd';
import moment from 'moment';
import { useGetCryptoNewsQuery } from '../../services/cryptoNews';
import { useGetCryptosQuery } from '../../services/cryptoAPI';
import Loader from '../NavBar/Loader';

const { Text, Title } = Typography;
const { Option } = Select;

const demoImageUrl =
  'https://www.bing.com/th?id=OVFT.mpzuVZnv8dwIMRfQGPbOPC&pid=News';

const News = ({ simplified }) => {
  // USESTATE
  const [newCategory, setnewCategory] = useState('Cryptocurrency');

  const { data: cryptoNews } = useGetCryptoNewsQuery({
    newCategory,
    count: simplified ? 6 : 12,
  });

  const { data } = useGetCryptosQuery(100);

  if (!cryptoNews?.value) return <Loader />;

  return (
    <Row gutter={[24, 24]}>
      {!simplified && (
        <Col span={24}>
          <Select
            showSearch
            className='select-news'
            placeholder='Select a crypto'
            optionFilterProp='children'
            onChange={(value) => setnewCategory(value)}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            <Option value='Cryptocurrency'>Cryptocurrency</Option>
            {data?.data?.coins.map((coin) => (
              <Option value={coin.name}>{coin.name}</Option>
            ))}
          </Select>
        </Col>
      )}

      {cryptoNews.value.map((news, i) => (
        <Col xs={24} sm={12} lg={8} key={i}>
          <Card hoverable className='news-card'>
            <a href={news.url} target='_blank' rel='noreferrer'>
              <div className='news-image-container'>
                <Title className='news-title' level={4}>
                  {news.name}
                </Title>
                <img
                  src={news?.image?.thumbnail?.contentUrl || demoImageUrl}
                  alt='news'
                />
              </div>
              <p>
                {news.description.length > 150
                  ? `${news.description.substring(0, 150)}...`
                  : news.description}
              </p>
              <div className='provider-container'>
                <div>
                  <Avatar
                    src={
                      news.provider[0]?.image?.thumbnail?.contentUrl ||
                      demoImageUrl
                    }
                    alt=''
                  />
                  <Text className='provider-name'>
                    {news.provider[0]?.name}
                  </Text>
                </div>
                <Text>
                  {moment(news.datePublished).startOf('ss').fromNow()}
                </Text>
              </div>
            </a>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default News;
