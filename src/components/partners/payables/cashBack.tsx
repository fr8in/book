import React, { useState } from 'react'
import { Table, Checkbox } from 'antd'
import get from 'lodash/get'
import u from '../../../lib/util'
import LinkComp from '../../common/link'
import isEmpty from 'lodash/isEmpty';



const cashBack = (props) => {

    const { loading, membership_data,partnerRegionFilter } = props
    const regions = u.regions
    const regionsList = regions.map((data) => {
        return { value: data.text, label: data.text }
    })
    const list = [{ label: "PENDING", value: "PENDING" },
    { label: "PAID", value: "PAID" }]

    const handleStatusChange = (value) => {
        props.handleStatusChange(value)
    }

    const onRegionFilter = (value) => {
        props.onRegionFilter(value)
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
            render: (text, record) => <LinkComp type='partners' data={text} id={record.cardcode} />,
            filterDropdown: (
                <Checkbox.Group
                    options={regionsList}
                    defaultValue={partnerRegionFilter}
                    onChange={onRegionFilter}
                    className='filter-drop-down'
                />
            )
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
            render: (text, record) => (get(record, 'partner_accounting.cleared', 0) + get(record, 'partner_accounting.onhold', 0)).toFixed(2)
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
            render: (text, record) => get(record, 'partner_membership_targets[0].cash_back_status'),
            filterDropdown: (
                <Checkbox.Group
                    options={list}
                    defaultValue={props.filter.status_id}
                    onChange={handleStatusChange}
                    className='filter-drop-down'
                />
            ),
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