import { Modal } from 'antd'
import React from 'react'
import _ from 'lodash'
import u from '../../../../lib/util'
import { Table, Button } from 'antd'

const IncentiveModal = (props) => {
    console.log("props", props)
    const groupedData = u.groupByMultipleProperty(props.data, function (item: any) {
        return [item.employee_code];
    })
    const filteredData = groupedData.map(incentives => {
        const travel_allowance = _.sumBy(incentives, 'travel_allowance')
        const order_incentive = _.sumBy(incentives, 'order_incentive')
        return {
            name: incentives[0].employee.name,
            travel_allowance,
            order_incentive,
            amount: _.sumBy(incentives, 'total_amount'),
            employee_code: incentives[0].employee_code
        }
    })
    const columns = [
        {
            title: "Employee",
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: "Travel Allowance",
            dataIndex: 'travel_allowance',
            key: 'travel_allowance'
        },
        {
            title: "Order Incentive",
            dataIndex: 'order_incentive',
            key: 'order_incentive'
        },
        {
            title: "Total",
            dataIndex: 'amount',
            key: 'amount'
        },
    ]
    const total = _.sumBy(filteredData, 'amount')
    return (
        <Modal
            visible={props.visible}
            onCancel={props.onCancel}
            title={props.title}
            footer={[
                <div key={1}>
                    <span className="pull-left" >Total: Rs{total}</span>
                    <Button key='back' onClick={props.onCancel}>Cancel</Button>
                    <Button key='submit' type='primary' >Ok</Button>
                </div>
            ]}
        >
            <Table
                columns={columns}
                dataSource={filteredData}
                size="small"
                pagination={false}
                rowKey={record => record.employee_code}
            />
        </Modal>
    )
}
export default IncentiveModal