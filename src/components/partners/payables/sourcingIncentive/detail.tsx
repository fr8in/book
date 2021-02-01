import React, { useState } from 'react'
import { Table, Checkbox } from 'antd'
import { useSubscription, gql, useQuery } from '@apollo/client'
import _ from 'lodash'
import moment from 'moment'
import LinkComp from '../../../common/link'

const SOURCING_INCENTIVE_DETAIL = gql`subscription getSourcingIncentive($year: Int, $month: Int, $employee_code: String, $incentive_type_id: [Int!]) {
    sourcing_incentive(where: {year: {_eq: $year}, month: {_eq: $month}, employee_code: {_eq: $employee_code}, incentive_type_id: {_in: $incentive_type_id}}) {
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
      partner {
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

const INCENTIVE_TYPE_QUERY = gql`query incentive_type{
    sourcing_incentive_type{
      id
      name
    }
  }`

const SourcingIncentiveDetail = (props) => {
    const [filter, setFilter] = useState({ incentive_type_id: [1, 2] })
    const { data, loading, error } = useSubscription(SOURCING_INCENTIVE_DETAIL, {
        skip: !props.year || !props.month,
        variables: {
            year: props.year,
            month: props.month,
            employee_code: props.employee_code,
            incentive_type_id: filter.incentive_type_id
        }
    })
    const { data: incentive_type_data } = useQuery(INCENTIVE_TYPE_QUERY)
    let _data = {}
    if (!loading) {
        _data = data
    }
    const sourcingIncentives = _.get(_data, 'sourcing_incentive', [])
    const sourcingIncentiveType = _.get(incentive_type_data, 'sourcing_incentive_type', [])
    const type_list = sourcingIncentiveType.map(type => { return { label: type.name, value: type.id } })

    const handleTypeChange = (value) => {
        setFilter({ incentive_type_id: value })
    }
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
            render: (text, record) => _.get(record, 'incentive_type.name'),
            filterDropdown: (
                <Checkbox.Group
                    options={type_list}
                    defaultValue={filter.incentive_type_id}
                    onChange={handleTypeChange}
                    className='filter-drop-down'
                />
            ),
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