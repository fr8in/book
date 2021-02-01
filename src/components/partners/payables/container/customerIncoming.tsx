import { useState } from 'react'
import { gql, useQuery } from '@apollo/client'
import now from 'lodash/now'
import get from 'lodash/get'
import { Table, Checkbox } from 'antd'
import moment from 'moment'
import isEmpty from 'lodash/isEmpty'

const CUSTOMER_INCOMING_PAYMENTS = gql`
query  bank_incoming${now()}($bank:[String]){
    bank_incoming(bank:$bank) {
      transno
      amount
      date
      details
      originno
      bank
    }
  }`
  const BANK_TYPE = gql `query bank_type {
    bank_type{
      bank
    }
  }`
const Customer_Incoming = () => {

    const [bankFilter, setBankFilter] = useState([])
    const { loading, data, error } = useQuery(
        CUSTOMER_INCOMING_PAYMENTS,
        {
            variables: { bank: bankFilter },
            fetchPolicy: 'cache-and-network',
            notifyOnNetworkStatusChange: true
        }
    )
    const {loading:typeLoading,data:bankType} = useQuery(BANK_TYPE)
    const bank_list= get(bankType,'bank_type',null)
    const bank_list_type = !isEmpty(bank_list) ? bank_list.map((data) =>{
        return data.bank
    }): []

    let _data = {}
    if (!loading) {
        _data = data
    }

    const bank_incoming = get(_data, 'bank_incoming', [])
   
    const columns = [
        {
            title: 'Reference No',
            dataIndex: 'transno',
            sorter: (a, b) => (a.transno > b.transno ? 1 : -1),
            width: '16%'
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            sorter: (a, b) => (a.date > b.date ? 1 : -1),
            width: '12%',
            render: (text, record) => text ? moment(parseInt(text)).format('DD-MMM-YY') : '-'
        },
        {
            title: 'Payment Details',
            dataIndex: 'details',
            width: '45%'
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            sorter: (a, b) => (a.amount > b.amount ? 1 : -1),
            width: '14%'
        },
        {
            title: 'Bank',
            dataIndex: 'bank',
            key: 'bank',
            width: '10%',
            filterDropdown: (
                <Checkbox.Group
                    options={bank_list_type}
                    onChange={(checked) => setBankFilter(checked)}
                    className='filter-drop-down'
                />
            )
        }
    ]

    return (
        <Table
            columns={columns}
            dataSource={bank_incoming}
            rowKey={(record) => record.transno}
            size='small'
            pagination={false}
            loading={loading}
            scroll={{ x: 1250 }}
        />
    )
}

export default Customer_Incoming