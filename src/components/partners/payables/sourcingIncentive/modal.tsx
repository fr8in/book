import React, { useContext, useState } from 'react'
import _ from 'lodash'
import { Table, Button, message, Modal } from 'antd'
import { gql, useMutation } from '@apollo/client'
import userContext from '../../../../lib/userContaxt'


const PROCESS_INCENTIVE = gql`mutation process_sourcing_incentive($ids: [Int!], $created_by: String) {
    process_sourcing_incentive(ids: $ids, created_by: $created_by) {
      status
      description
    }
  }`

const IncentiveModal = (props) => {

    const context = useContext(userContext)
    const [buttonLoading, setButtonLoading] = useState(false)

    const [processIncentive] = useMutation(PROCESS_INCENTIVE, {
        onError(error) {
            message.error(error.toString())
            setButtonLoading(false)
        },
        onCompleted(data) {
            if (data.process_sourcing_incentive.status === "OK") {
                message.success(data.process_sourcing_incentive.description)
                props.onCancel()
                props.onChange([])
            }
            else {
                message.error(data.process_sourcing_incentive.description ? data.process_sourcing_incentive.description : "Error occurred")
            }
            setButtonLoading(false)
        }
    })
    let ids = props.data.map(incentive => incentive.incentive_ids)
    ids = ids.flat(3)
    const processSourcingIncentive = () => {
        setButtonLoading(true)
        processIncentive({
            variables: {
                ids: ids,
                created_by: context.email
            }

        })
    }
    const columns = [
        {
            title: "Employee",
            dataIndex: 'employee_name',
            key: 'employee_name'
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
    const total = _.sumBy(props.data, 'amount')
    return (
        <Modal
            visible={props.visible}
            title={props.title}
            closable={false}
            maskClosable={!buttonLoading}
            footer={[
                <div key={1}>
                    <span className="pull-left" >Total: Rs{total}</span>
                    <Button key='back' onClick={props.onCancel}>Cancel</Button>
                    <Button key='submit' type='primary' loading={buttonLoading} onClick={processSourcingIncentive}>Ok</Button>
                </div>
            ]}
        >
            <Table
                columns={columns}
                dataSource={props.data}
                size="small"
                pagination={false}
                rowKey={record => record.employee_code}
            />
        </Modal>
    )
}
export default IncentiveModal