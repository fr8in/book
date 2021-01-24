import React, { useState } from 'react'

import { useSubscription, gql } from '@apollo/client'
import _ from 'lodash'
import { Table, Input } from 'antd'
import LinkComp from '../../../common/link'
import SourcingIncentiveDetail from './detail'
import { SearchOutlined, CommentOutlined } from '@ant-design/icons'


const SOURCING_INCENTIVE_SUBSCRIPTION = gql`subscription getSourcingIncentiveLog($year: Int, $month: Int, $employee_name: String) {
    sourcing_incentive_log(where: {year: {_eq: $year}, month: {_eq: $month}, employee: {name: {_ilike: $employee_name}}}, order_by: {employee: {name: asc}}) {
        id
      employee_code
      partner_code
      travel_allowance
      order_incentive
      total_amount
      created_at
      employee {
        id
        name
      }
      partner{
        id
        cardcode
        name
      }
    }
  }`;

const SourcingIncentive = (props) => {
    const [search, setSearch] = useState(null)

    const { data, loading, error } = useSubscription(SOURCING_INCENTIVE_SUBSCRIPTION, {
        skip: !props.year || !props.month,
        variables: {
            year: props.year,
            month: props.month,
            employee_name: search ? `%${search}%` : null
        }
    })

    let _data = {}
    if (!loading) {
        _data = data
    }
    const sourcingIncentives = _.get(_data, 'sourcing_incentive_log', [])


    const onSelectChange = (selectedRowKeys, selectedRows) => {
        props.onChange(selectedRows)
    }
    const rowSelection = {
        onChange: onSelectChange
    }
    const handleEmployeeSearch = (e) => {
        setSearch(e.target.value)
    }

    const columns = [
        {
            title: 'Employee',
            dataIndex: 'employee_code',
            key: 'employee_code',
            width: '20%',
            render: (text, record) => _.get(record, 'employee.name'),
            filterDropdown: (
                <div>
                    <Input
                        placeholder='Search Employee'
                        value={search}
                        onChange={handleEmployeeSearch}
                    />
                </div>
            ),
            filterIcon: () => <SearchOutlined style={{ color: search ? '#1890ff' : undefined }} />
        },
        {
            title: 'Partner Name',
            dataIndex: 'partner_code',
            key: 'partner_code',
            width: '20%',
            render: (text, record) => <LinkComp type='partners' data={_.get(record, 'partner.name')} id={_.get(record, 'partner.id')} />
        },
        {
            title: 'Travel Allowance',
            dataIndex: 'travel_allowance',
            key: 'travel_allowance',
            width: '20%'
        },
        {
            title: 'Order Incentive',
            dataIndex: 'order_incentive',
            key: 'order_incentive',
            width: '20%'
        },
        {
            title: 'Total Amount',
            dataIndex: 'total_amount',
            key: 'total_amount',
            width: '20%'
        }
    ]
    return (
        <Table
            columns={columns}
            dataSource={sourcingIncentives}
            pagination={false}
            size='small'
            scroll={{ x: 1156 }}
            loading={loading}
            rowSelection={rowSelection}
            expandedRowRender={record =>
                <SourcingIncentiveDetail partner_code={record.partner_code} employee_code={record.employee_code} />}
            rowKey={record => record.id}
        />
    )


}

export default SourcingIncentive