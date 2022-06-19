import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Transactions from './Transactions';

import { Input, Button, Alert, Select, message } from 'antd';
import './trading.styles.scss';
import { useSelector } from 'react-redux';
import UserService from '../../services/user.service';
import { setInvestment } from '../../slices/investments.slice';
import { setTransaction } from '../../slices/transactions.slice';

import { isEmpty } from 'lodash';
import Loader from '../NavBar/Loader';

const Option = Select.Option;

const Trading = () => {
  const dispatch = useDispatch();

  // USESELECTOR
  const userId = useSelector((state) => state?.auth?.user?.userId);
  const investments = useSelector((state) => state?.investment.investment);
  const transaction = useSelector((state) => state?.transaction?.transaction);

  // USESTATE
  const [data, setData] = useState(investments);
  const [coinName, setCoinName] = useState('');
  const [transactions, setTransactions] = useState(transaction);
  const [totalRecords, setTotalRecords] = useState(0);
  const [maxValue, setMaxValue] = useState(0);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [sendingValue, setSendingValue] = useState(0);
  const [selectToken, setSelectToken] = useState('');

  // USEEFFECT
  useEffect(async () => {
    if (isEmpty(investments) && userId) {
      const result = await UserService.getMyInvestment(userId);
      dispatch(setInvestment(result));
      setData(result);
    }
  }, []);

  useEffect(async () => {
    if (isEmpty(transaction) && userId) {
      const trx = await UserService.getTransactionHistory(userId, '', '', 0, 0, 10);
      setTransactions(trx.transactions);
      setTotalRecords(trx.totalRecords);
      dispatch(setTransaction(trx.transactions));
    }
  }, [transactions]);

  // USEMEMO
  const isValidSendingAmount = useMemo(() => {
    if (!selectToken) return true;
    if (sendingValue < 0 || sendingValue > maxValue) return false;
    return true;
  }, [maxValue, sendingValue, selectToken]);

  const listSymbols = data?.map((d) => d.symbol) || [];
  const onSetRecipientAddress = (value) => setRecipientAddress(value);

  const onSelectValue = (value) => {
    setSelectToken(value);
    setMaxValue(
      investments?.find(({ symbol, name }) => {
        setCoinName(name);
        return symbol === value;
      }).volumes || 0
    );
  };

  const onSetSendingValue = (value) => setSendingValue(value);

  const onSendingToken = async () => {
    const result = await UserService.tradingToken(
      userId,
      recipientAddress,
      Number(sendingValue),
      selectToken,
      coinName
    );

    if (result.status === 200 || result.status === 201) {
      message.success('Your token was successful sent ');

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };

  if (!userId) return <Redirect to="/login" />;
  if (!data || !transaction) return <Loader />;

  const listOfYourTokens = (
    <>
      <Button
        style={{ marginLeft: 0 }}
        onClick={() => onSetSendingValue(maxValue)}
        type="primary"
      >
        Max
      </Button>
      <Select
        showSearch
        style={{ width: 200 }}
        placeholder="Search to Select"
        optionFilterProp="children"
        onChange={(value) => onSelectValue(value)}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        filterSort={(optionA, optionB) =>
          optionA.children
            .toLowerCase()
            .localeCompare(optionB.children.toLowerCase())
        }
      >
        {listSymbols.map((token) => (
          <Option key={token} value={token}>
            {token}
          </Option>
        ))}
      </Select>
    </>
  );

  return (
    <div>
      <div className="sending-container">
        <Input
          addonAfter="Recipient Address"
          placeholder="Recipient Address"
          onChange={(e) => onSetRecipientAddress(e.target.value)}
          width={500}
          allowClear
        />
        <Input
          addonAfter={listOfYourTokens}
          value={sendingValue}
          placeholder="Amount"
          onChange={(e) => onSetSendingValue(e.target.value)}
          width={500}
          allowClear
        />
        {isValidSendingAmount ? (
          <Button
            type="primary"
            style={{ left: '40%', marginTop: 5 }}
            onClick={() => onSendingToken()}
          >
            Sending
          </Button>
        ) : (
          <Alert
            message="You balance is not sufficient"
            type="error"
            width={500}
          />
        )}
      </div>
      <Transactions
        listSymbols={listSymbols}
        userId={userId}
        transactions={transactions}
        totalRecords={totalRecords}
      />
    </div>
  );
};

export default Trading;
