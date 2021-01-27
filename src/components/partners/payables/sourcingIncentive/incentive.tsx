import React, { useState } from 'react'

import { useSubscription, gql } from '@apollo/client'
import _ from 'lodash'
import { Table, Input } from 'antd'
import LinkComp from '../../../common/link'
import SourcingIncentiveDetail from './detail'
import { SearchOutlined, CommentOutlined } from '@ant-design/icons'
import u from '../../../../lib/util'

const SOURCING_INCENTIVE_SUBSCRIPTION = gql`subscription getSourcingIncentiveLog($year: Int, $month: Int, $employee_name: String) {
    sourcing_incentive_log(where: {year: {_eq: $year}, month: {_eq: $month},status:{_in:["PENDING","INITIATED"]}, employee: {name: {_ilike: $employee_name}}}, order_by: {employee: {name: asc}}) {
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


    const groupedData = u.groupByMultipleProperty(sourcingIncentives, function (item: any) {
        return [item.employee_code];
    })
    const filteredData = groupedData.map((incentives, i) => {
        const travel_allowance = _.sumBy(incentives, 'travel_allowance')
        const order_incentive = _.sumBy(incentives, 'order_incentive')
        return {
            id: i,
            incentive_ids: incentives.map(data => data.id),
            name: incentives[0].employee.name,
            travel_allowance,
            order_incentive,
            amount: _.sumBy(incentives, 'total_amount'),
            employee_code: incentives[0].employee_code,
            partner_code: incentives[0].partner_code,
            employee_name: _.get(incentives[0], 'employee.name', null)
        }
    })

    const handleEmployeeSearch = (e) => {
        setSearch(e.target.value)
    }

    const columns = [
        {
            title: "Employee",
            dataIndex: 'name',
            key: 'name',
            width: "25%",
            render: (text, record) => _.get(record, 'name'),
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
            title: "Travel Allowance",
            dataIndex: 'travel_allowance',
            key: 'travel_allowance',
            width: "25%"
        },
        {
            title: "Order Incentive",
            dataIndex: 'order_incentive',
            key: 'order_incentive',
            width: "25%"
        },
        {
            title: "Total",
            dataIndex: 'amount',
            key: 'amount',
            width: "25%"
        },
    ]

    const onSelectChange = (selectedRowKeys, selectedRows) => {
        props.onChange(selectedRows)
    }
    const rowSelection = {
        onChange: onSelectChange
    }

    return (
        <Table
            columns={columns}
            dataSource={filteredData}
            pagination={false}
            size='small'
            scroll={{ x: 1156 }}
            loading={loading || props.loading}
            rowSelection={rowSelection}
            expandedRowRender={record =>
                <SourcingIncentiveDetail year={props.year} month={props.month}
                    partner_code={record.partner_code} employee_code={record.employee_code} />}
            rowKey={record => record.employee_code}
        />
    )


}

export default SourcingIncentive