import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Table, Typography } from 'antd';
import Loader from '../NavBar/Loader';
import { useSelector } from 'react-redux';
import SearchSelect from '../SearchSelect/SearchSelect';
import { isEmpty } from 'lodash';
import UserService from '../../services/user.service';
import { useDispatch } from 'react-redux';
import { setInvestment } from '../../slices/investments.slice';

const { Text } = Typography;
const Investment = () => {
  const dispatch = useDispatch();

  // USESELECTOR
  const investments = useSelector((state) => state.investment.investment);
  const userId = useSelector((state) => state?.auth?.user?.userId);

  // USESTATE
  const [data, setData] = useState(investments);

  // USEEFFECT
  useEffect(() => {
    const fetchData = async () => {
      if (isEmpty(investments) && userId) {
        const result = await UserService.getMyInvestment(userId);
        setData(result);
        dispatch(setInvestment(result));
      }
    };
    fetchData();
  });

  const selectValue = investments?.map((e) => e.symbol) || [];
  const onSelectToken = (value) => {
    setData(investments.filter((i) => i.symbol === value));
    if (!value) setData(investments);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (_, { iconUrl, name }) => {
        return (
          <div
            className="token-name"
            style={{ display: 'flex', flexDirection: 'row' }}
          >
            <img
              className="crypto-image"
              src={`${iconUrl}`}
              width={30}
              height={25}
              style={{ marginRight: 20 }}
              alt={name}
            />
            <h3>{name}</h3>
          </div>
        );
      },
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (_, { price }) => (
        <h4>${new Intl.NumberFormat().format(price)}</h4>
      ),
    },
    {
      title: 'Your tokens',
      dataIndex: 'volumes',
      key: 'volumes',
      render: (_, { volumes, symbol }) => (
        <h4>
          {new Intl.NumberFormat().format(volumes)} {symbol}
        </h4>
      ),
    },
    {
      title: 'Current Balance',
      key: 'currentBalance',
      render: (_, { price, volumes }) => (
        <h4>
          $
          {new Intl.NumberFormat().format(
            Number(Number(price) * volumes).toFixed(2)
          )}
        </h4>
      ),
    },
  ];

  if (!userId) return <Redirect to="/login" />;
  if (!data) return <Loader />;

  return (
    <>
      <SearchSelect data={selectValue} onSelectValue={onSelectToken} />
      <Table
        columns={columns}
        dataSource={data}
        summary={(pageData) => {
          let totalBalance = 0;

          pageData.forEach(({ volumes, price }) => {
            totalBalance += volumes * +price;
          });

          return (
            <>
              <Table.Summary.Row style={{ fontSize: 30 }}>
                <Table.Summary.Cell>Total</Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text>${new Intl.NumberFormat().format(totalBalance)}</Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );
        }}
      />
    </>
  );
};

export default Investment;
