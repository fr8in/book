import { Modal, Checkbox, Row, Col, Tag } from 'antd'
import { useState } from 'react'
import { gql, useQuery } from '@apollo/client'
import get from 'lodash/get'

const PAYMENTMANAGERLIST = gql`
query paymentManager {
  trip_dispatch_pending_list_by_payment_manager{
    payment_manager
    trips
    payment_manager_id
  }
}
`
const EmployeeListFilter = (props) => {
    const { visible, onHide, onFilterChange, payment_Manager } = props

    const [checkAll, setCheckAll] = useState(false)

    const { loading, error, data } = useQuery(
        PAYMENTMANAGERLIST,
        {
            fetchPolicy: 'cache-and-network',
            notifyOnNetworkStatusChange: true
        }
    )

    let paymentManager = []
    if (!loading) {
        paymentManager = get(data, 'trip_dispatch_pending_list_by_payment_manager', null)
    }

    const paymentManagerList = paymentManager.map((data) => {
        return { 
            value: data.payment_manager, 
            label: <span> {data.payment_manager} <Tag color='#40a9ff'>{data.trips}</Tag></span> 
        }
    })

    const onChange = (checkedValues) => {
        onFilterChange(checkedValues)
    }

    const onCheckall = (e) => {
        setCheckAll(e.target.checked)
        const all_paymentManager = paymentManager.map((data) => data.payment_manager)
        onFilterChange(e.target.checked ? all_paymentManager : [])
    }

    return (
        <Modal
            visible={visible}
            onCancel={onHide}
            footer={null}
        >
            <Row>
                <Checkbox onChange={onCheckall} checked={checkAll}>All</Checkbox>
                <Col xs={24} className='emp-list'>
                    <Checkbox.Group
                        options={paymentManagerList}
                        defaultValue={payment_Manager}
                        value={payment_Manager}
                        onChange={onChange}
                    />
                </Col>
            </Row>
        </Modal>
    )
}

export default EmployeeListFilter

