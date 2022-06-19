import React, { useState } from 'react';

import { LIST_TYPES } from '../../constants/trading.constants';
import { Table, Select, DatePicker, Button } from 'antd';
import UserService from '../../services/user.service';
import moment from 'moment';
import { isEmpty } from 'lodash';
import Loader from '../NavBar/Loader';

const Transactions = ({ listSymbols, userId, transactions, totalRecords }) => {
  // USESTATE
  const [data, setData] = useState(transactions);
  const [selectToken, setSelectToken] = useState('');
  const [selectType, setSelectType] = useState('');
  const [selectDate, setSelectDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1)
  const [total, setTotal] = useState(totalRecords)

  const columns = [
    {
      title: 'Id Transaction',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: 'From',
      dataIndex: 'senderId',
      key: 'senderId',
    },
    {
      title: 'To',
      dataIndex: 'recipientId',
      key: 'recipientId',
    },
    {
      title: 'Value',
      key: 'value',
      render: (_, { amount, symbol }) => (
        <h5>
          {amount} {symbol}
        </h5>
      ),
    },
    {
      title: 'Method',
      key: 'type',
      render: (_, { type }) => {
        if (type === 'WITHDRAWAL')
          return <h5 className='withdrawal-header'>{type}</h5>;
        return <h5 className='deposit-header'>{type}</h5>;
      },
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, { status }) => <h5>{status}</h5>,
    },
    {
      title: 'Time',
      key: 'time',
      render: (_, { timestamps }) => {
        return <h5>{moment(timestamps).format('YYYY-MM-DD HH:mm:ss')}</h5>;
      },
    },
  ];

  const onSelectTokenValue = (value) => setSelectToken(value);
  const onSelectTypeValue = (value) => setSelectType(value);
  const onSelectDateValue = (value) => {
    setSelectDate(value);
  };

  const onSearchTransaction = async (page) => {
    const timestamp = Math.floor(moment(selectDate).valueOf()) || 0;

    const result = await UserService.getTransactionHistory(
      userId,
      selectToken || '',
      selectType || '',
      timestamp,
      page,
      10
    );

    setData(result.transactions);
    setTotal(result.totalRecords)
  };

  if (isEmpty(data)) return <Loader />

  return (
    <div>
      <div className='searching-container'>
        <Select
          showSearch
          style={{ width: 200 }}
          placeholder='Search Token'
          optionFilterProp='children'
          onChange={(value) => onSelectTokenValue(value)}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          filterSort={(optionA, optionB) =>
            optionA.children
              .toLowerCase()
              .localeCompare(optionB.children.toLowerCase())
          }
          allowClear>
          {listSymbols.map((token) => (
            <Select.Option key={token} value={token}>
              {token}
            </Select.Option>
          ))}
        </Select>

        <Select
          style={{ width: 200 }}
          placeholder='Status'
          allowClear
          onChange={(value) => onSelectTypeValue(value)}>
          {LIST_TYPES.map((type) => (
            <Select.Option key={type} value={type}>
              {type}
            </Select.Option>
          ))}
        </Select>
        <DatePicker onChange={(value) => onSelectDateValue(value)} />

        <Button type='primary' onClick={() => onSearchTransaction()}>
          Search
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        scroll={{ y: 240 }}
        pagination={{
          current: currentPage,
          total: total,
          pageSize: 10,
          onChange: async (page) => {
            setCurrentPage(page)
            await onSearchTransaction(page)
          }
        }}
      />
    </div>
  );
};

export default Transactions;
