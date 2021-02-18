import { Select, Modal, message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

import { gql, useQuery, useMutation, useSubscription, useLazyQuery } from '@apollo/client'
import get from 'lodash/get'

import Loading from '../common/loading'

const { confirm } = Modal;



import now from 'lodash/now'
import { useState } from 'react'
const { Option } = Select;

const ACTIVE_BANK = gql`
query active_banke${now()}($type: String!) {
  active_transaction_source_by_pk(type: $type) {
    source
    type
  }
  gl_account_config(where: {type: {_eq: $type}}) {
    name
    type
  }
}
`

const UPDATE_PRIMARY_BANK = gql`
mutation updatePrimaryBank($type: String!, $bank: String!) {
  update_active_transaction_source_by_pk(pk_columns: {type: $type}, _set: {source: $bank}) {
    source
    type
  }
}`


const PrimaryBank = (props) => {
  const { changeDownTime ,isAdmin} = props

  const [bankName, setBankName] = useState(null)

  const { loading, data } = useQuery(
    ACTIVE_BANK, {
    variables: { type: 'BANK' },
    fetchPolicy: 'network-only'
  })

  let _data = {}
  if (!loading) {
    _data = data
  }
  let active_bank = get(_data, 'active_transaction_source_by_pk.source', null)
  console.log("🚀 ~ file: primaryBank.tsx ~ line 55 ~ PrimaryBank ~ active_bank", active_bank)
  let available_banks = get(_data, 'gl_account_config', [])

  const [UpdatePrimaryBank, { loading: mutationLoading }] = useMutation(

    UPDATE_PRIMARY_BANK,
    {
      onError(error) { message.error(error.toString()) },
      onCompleted() {
        let nonPrimaryBank = available_banks.filter(bank => bank.name !== bankName)
        nonPrimaryBank.length > 0 && changeDownTime(false, nonPrimaryBank[0].name)
        message.success(`Primary bank changed for Outgoing Transactions`)
      }
    }
  )

  console.log("🚀 ~ file: primaryBank.tsx ~ line 62 ~ PrimaryBank ~ mutationLoading", mutationLoading)

  const handleChange = (value) => {
    console.log(`selected ${value}`);
    confirmBankModal(value)
    setBankName(value)
  }
  const onBankChange = (bank) => {
    UpdatePrimaryBank({
      variables: {
        type: 'BANK',
        bank: bank
      }
    })
  }

  const confirmBankModal = (bank) => confirm({
    title: `Are you sure to change to ${bank.toLowerCase()} Bank?`,
    icon: <ExclamationCircleOutlined />,
    content:<p>{`1. Partner Wallet to Bank Transfer`}<br/>
    {`2. Customer Mamul Transfer`}<br/>
    {`3. Additional advance to wallet`}<br/>
    {`will refer to ${bank.toLowerCase()} bank`}</p>,
    maskClosable: true,
    onOk() {
      onBankChange(bank)
    }
  });

  return (
    <>
      <Select
        value={active_bank}
        style={{ width: 120 }}
        onChange={(value) => handleChange(value)}
        loading={false}
        disabled={!isAdmin}
      >
        {available_banks.map(bank => <Option value={bank.name} key={bank.name}  >{bank.name}</Option>)}
      </Select>

      {mutationLoading &&
        <Loading fixed />}
    </>
  )
}
export default PrimaryBank
