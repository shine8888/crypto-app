import React from 'react';
import { Select } from 'antd';

import './styles.scss';

const Option = Select.Option;

const SearchSelect = ({ data, onSelectValue }) => {
  return (
    <div className='search--select'>
      <Select
        showSearch
        allowClear
        style={{ width: 200 }}
        placeholder='Search to Select'
        optionFilterProp='children'
        onChange={(value) => onSelectValue(value)}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        filterSort={(optionA, optionB) =>
          optionA.children
            .toLowerCase()
            .localeCompare(optionB.children.toLowerCase())
        }>
        {data.map((token) => (
          <Option key={token} value={token}>
            {token}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default SearchSelect;
