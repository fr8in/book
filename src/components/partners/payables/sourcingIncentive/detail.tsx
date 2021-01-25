import React from 'react'
import { Table } from 'antd'
import { useSubscription, gql } from '@apollo/client'
import _ from 'lodash'
import moment from 'moment'
import LinkComp from '../../../common/link'

const SOURCING_INCENTIVE_DETAIL = gql`subscription getSourcingIncentive($year: Int, $month: Int, $employee_code: String) {
    sourcing_incentive(where: {year: {_eq: $year}, month: {_eq: $month}, employee_code: {_eq: $employee_code}}) {
      id
      employee_code
      partner_code
      order_count
      on_boarded_at
      order_taken_at
      is_partner_active
      is_partner_blacklisted
      month
      amount
      year
      partner{
        id
        cardcode
        name
      }
      incentive_type {
        id
        name
      }
    }
  }`

const SourcingIncentiveDetail = (props) => {
    const { data, loading, error } = useSubscription(SOURCING_INCENTIVE_DETAIL, {
        skip: !props.year || !props.month,
        variables: {
            year: props.year,
            month: props.month,
            employee_code: props.employee_code
        }
    })
    let _data = {}
    if (!loading) {
        _data = data
    }
    const sourcingIncentives = _.get(_data, 'sourcing_incentive', [])
    const columns = [
        {
            title: 'Partner Name',
            dataIndex: 'partner_code',
            key: 'partner_code',
            width: '20%',
            sorter: (a, b) => (a.partner.name > b.partner.name ? 1 : -1),
            render: (text, record) => <LinkComp type='partners' data={_.get(record, 'partner.name')} id={_.get(record, 'partner.id')} />
        },
        {
            title: 'Incentive Type',
            dataIndex: 'incentive_type',
            key: 'incentive_type',
            width: '20%',
            render: (text, record) => _.get(record, 'incentive_type.name')
        },
        {
            title: 'On-Boarded Date',
            dataIndex: 'on_boarded_at',
            key: 'on_boarded_at',
            width: '10%',
            render: (text, record) => _.get(record, 'on_boarded_at', null) ? moment(_.get(record, 'on_boarded_at', null)).format("YYYY-MM-DD") : ""
        },
        {
            title: 'Order Date',
            dataIndex: 'order_taken_at',
            key: 'order_taken_at',
            width: '10%',
            render: (text, record) => _.get(record, 'order_taken_at', null) ? moment(_.get(record, 'order_taken_at', null)).format("YYYY-MM-DD") : ""
        },
        {
            title: 'Partner Status',
            dataIndex: 'is_partner_active',
            key: 'is_partner_active',
            width: '10%',
            render: (text, record) => _.get(record, 'is_partner_active', null) ? "ACTIVE" : "IN_ACTIVE"
        },
        {
            title: 'Order Count',
            dataIndex: 'order_count',
            key: 'order_count',
            width: '10%',
            sorter: (a, b) => a.order_count - b.order_count
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            width: '10%',
            sorter: (a, b) => a.amount - b.amount
        }
    ]
    return (
        <Table
            columns={columns}
            dataSource={sourcingIncentives}
            pagination={false}
            size="middle"
            loading={loading}
            rowKey={record => record.id}
        />
    )
}

export default SourcingIncentiveDetail