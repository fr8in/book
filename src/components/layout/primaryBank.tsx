import { Select, Modal, message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

import { gql, useQuery, useMutation, useSubscription, useLazyQuery } from '@apollo/client'
import get from 'lodash/get'


import useShowHide from '../../../src/hooks/useShowHide'
import Loading from '../common/loading'

const { confirm } = Modal;



import now from 'lodash/now'
import { useState } from 'react'
const { Option } = Select;

const ACTIVE_BANK = gql`
query active_banke${'990'}($type: String!) {
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
  const { changeDownTime } = props
const [changePrimaryBankLoading , setPrimaryBankLoading] = useState(false)
const [bankName , setBankName] = useState(null)

  const { loading, data, error } = useQuery(
    ACTIVE_BANK, {
    variables: { type: 'BANK' },
    fetchPolicy: 'network-only'  
  })

  let _data = {}

  if (!loading) {
    _data = data
  }
  //setPrimaryBankLoading(true)
  let active_bank = get(_data, 'active_transaction_source_by_pk.source', null)
  let available_banks = get(_data, 'gl_account_config', [])

  const [UpdatePrimaryBank] = useMutation(
    UPDATE_PRIMARY_BANK,
    {
      onError(error) { setPrimaryBankLoading(true); message.error(error.toString()) },
      onCompleted(){
        setPrimaryBankLoading(true);  
        let nonPrimaryBank =  available_banks.filter(bank=>bank.name !==bankName)
        console.log('nonPrimaryBank' ,nonPrimaryBank)
        nonPrimaryBank.length >0 && changeDownTime(false , nonPrimaryBank[0].name)
        message.success(`primary bank changed`)
    
    }
    }
  )



  const handleChange = (value) => {
    
    console.log(`selected ${value}`);
    confirmBankModal(value)
    setBankName(value)
  }
  const onBankChange = (bank) => {
    setPrimaryBankLoading(true)
    UpdatePrimaryBank({
      variables: {
        type: 'BANK',
        bank: bank
      }
    })
  }


  const confirmBankModal = (bank) => confirm({
    title: `Are you sure to change to ${bank}?`,
    icon: <ExclamationCircleOutlined />,
    content: `1.Partner Wallet to Bank Transfer
     2.Customer Mamul Transfer 
     3.Additional advancd to wallet will refer to bank `,
    maskClosable: true,
    onOk() {
      onBankChange(bank)
    }
  });

  return (
    <>
      <Select
        defaultValue={active_bank}
        style={{ width: 120 }}
        onChange={(value) => handleChange(value)}
        loading={false}
      >
        {available_banks.map(bank => <Option value={bank.name} key={bank.name}  >{bank.name}</Option>)}
      </Select>

      {changePrimaryBankLoading &&
        <Loading fixed />} 
    </>
  )
}

export default PrimaryBank
