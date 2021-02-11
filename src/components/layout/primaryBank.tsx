import { Select } from 'antd'
import { SwapOutlined } from '@ant-design/icons'
import { useContext, useState } from 'react'
import { gql, useQuery, useMutation, useSubscription, useLazyQuery } from '@apollo/client'
import get from 'lodash/get'
import u from '../../lib/util'
import userContext from '../../lib/userContaxt'

import useShowHide from '../../hooks/useShowHide'
import now from 'lodash/now'
const { Option } = Select;

const handleChange = (value) => {
  console.log(`selected ${value}`);
  
}

const bank_list = ['ICICI', 'YES']

const PrimaryBank = () => {
  return (
    <Select

      defaultValue="ICICI"
      style={{ width: 120 }}
      onChange={handleChange}
      loading={false}
    >
      {bank_list.map(bank => <Option value={bank} key={bank}  >{bank}</Option>)}
    </Select>
  )
}

export default PrimaryBank
