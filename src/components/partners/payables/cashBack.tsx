import React, { forwardRef } from 'react'
import { useSubscription, gql, useQuery, useMutation } from '@apollo/client'
import { Table, message } from 'antd'
import get from 'lodash/get'
import LinkComp from '../../common/link'

const CASH_BACK_QUERY = gql`subscription partner_membership($year: Int, $month: Int) {
    partner(where: {partner_membership_targets: {year: {_eq: $year}, month: {_eq: $month}, cash_back_applicable: {_eq: true}}, partner_status: {name: {_neq: "Blacklisted"}}}) {
      id
      cardcode
      name
      partner_membership_targets(where: {month: {_eq: $month}, year: {_eq: $year}}) {
        id
        year
        month
        partner_code
        transaction_fee
        cash_back_amount
        cash_back_percent
        cash_back_status
      }
      partner_accounting {
        cleared
        onhold
        wallet_balance
      }
    }
  }`



const cashBack = (props) => {

    const { data, loading, error } = useSubscription(CASH_BACK_QUERY, {
        skip: !props.year || !props.month,
        variables: {
            year: props.year,
            month: props.month
        }
    })



    console.log("data", data, loading, error)

    let membership_data = []
    if (!loading) {
        membership_data = get(data, 'partner', [])
    }
    const columns = [
        {
            title: 'Partner Code',
            dataIndex: 'cardcode',
            key: 'cardcode',
            width: '8%'
        },
        {
            title: 'Partner Name',
            dataIndex: 'name',
            key: 'name',
            width: '8%',
            render: (text, record) => <LinkComp type='partners' data={text} id={record.cardcode} blank />
        },
        {
            title: 'Wallet',
            dataIndex: 'wallet',
            key: 'wallet',
            width: '8%',
            render: (text, record) => get(record, 'partner_accounting.wallet_balance', 0)
        },
        {
            title: 'Cleared',
            dataIndex: 'cleared',
            key: 'cleared',
            width: '8%',
            render: (text, record) => get(record, 'partner_accounting.cleared', 0) + get(record, 'partner_accounting.onhold', 0)
        },
        {
            title: 'Transaction Fee',
            dataIndex: 'transactionFee',
            key: 'transactionFee',
            width: '8%',
            render: (text, record) => get(record, 'partner_membership_targets[0].transaction_fee')
        },
        {
            title: 'CashBack Percentage',
            dataIndex: 'cashBacnkPercentage',
            key: 'cashBacnkPercentage',
            width: '8%',
            render: (text, record) => get(record, 'partner_membership_targets[0].cash_back_percent')
        },
        {
            title: 'CashBack Amount',
            dataIndex: 'cashBackAmount',
            key: 'cashBackAmount',
            width: '8%',
            render: (text, record) => get(record, 'partner_membership_targets[0].cash_back_amount')
        },
        {
            title: 'CashBack Status',
            dataIndex: 'cash_back_status',
            key: 'cash_back_status',
            width: '8%',
            render: (text, record) => get(record, 'partner_membership_targets[0].cash_back_status')
        }

    ]




    return (
        <Table
            dataSource={membership_data}
            columns={columns}
            size='small'
            scroll={{ x: 1156 }}
            pagination={false}
            loading={loading}
            rowKey={(record) => record.cardcode}
        />
    )
}


export default cashBack