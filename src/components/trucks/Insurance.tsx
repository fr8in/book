import React, { useContext, useState } from 'react'
import { Button, message, Table, Tooltip, Modal, Radio } from 'antd'
import { CommentOutlined } from '@ant-design/icons'
import { gql, useSubscription, useMutation, useQuery } from '@apollo/client'
import get from 'lodash/get'
import LinkComp from '../common/link'
import Phone from '../common/phone'
import u from '../../lib/util'
import moment from 'moment'
import userContext from '../../lib/userContaxt'
import InsuranceUpdate from './insuranceUpdate'
import useShowHideWithRecord from '../../hooks/useShowHideWithRecord'
import InsuranceComment from './insuranceComment'

const INSURANCE_SUBSCRIPTION = gql`subscription insurance_data($status_id:Int) {
    insurance(where:{status_id:{_eq:$status_id}}) {
      id
      status {
        id
        name
      }
      amount
      cash_back_amount
      last_comment: comments(order_by: {id: desc}, limit: 1) {
        id
        description
      }
      truck {
        id
        truck_no
        insurance_expiry_at
      }
      partner {
        id
        name
        partner_users(where: {is_admin: {_eq: true}}) {
          id
          mobile
        }
      }
    }
  }`

const INSURANCE_STATUS = gql`query insurance_status {
    insurance_status {
      id
      name
    }
  }`

const UPDATE_INSURANCE = gql`mutation update_insurance($amount: float8, $cash_back_amount: float8, $status_id: Int, $id: Int, $updated_at: timestamp, $updated_by: String) {
    update_insurance(_set: {amount: $amount, cash_back_amount: $cash_back_amount, status_id: $status_id, updated_at: $updated_at, updated_by: $updated_by}, where: {id: {_eq: $id}}) {
      affected_rows
    }
  }`

const Insurance = () => {

    const initial = {
        commentVisible: false,
        commentData: []
    }


    const [status, setStatus] = useState(1)
    const { data: status_data, loading: statusLoading } = useQuery(INSURANCE_STATUS)
    const { object, handleShow, handleHide } = useShowHideWithRecord(initial)
    const { role, MAX_INSURANCE_CASHBACK } = u
    const edit_access = [role.admin, role.partner_manager, role.onboarding]


    const { data, loading, error } = useSubscription(INSURANCE_SUBSCRIPTION, {
        variables: {
            status_id: status
        }
    })

    const context = useContext(userContext)
    let list = []
    if (!loading) {
        list = get(data, 'insurance', [])
    }
    let statusList = []
    if (!statusLoading) {
        statusList = get(status_data, 'insurance_status', [])
        statusList = statusList.map(status => { return { value: status.id, label: status.name } })
    }

    const [update_insurance] = useMutation(UPDATE_INSURANCE, {
        onError(error) { message.error(error.toString()) },
        onCompleted(data) {
            if (data.update_insurance.affected_rows = 1) {
                message.success("Updated")
            }
        }
    })

    const updateInsurance = (value, record, type) => {
        if (type === "cash_back_amount" && value > MAX_INSURANCE_CASHBACK)
            message.info(`Cash back amount cannot be more than ${MAX_INSURANCE_CASHBACK}`)
        else {
            update_insurance({
                variables: {
                    updated_at: moment().format("YYYY-MM-DD HH:MM:ss"),
                    updated_by: context.email,
                    id: record.id,
                    amount: record.amount,
                    cash_back_amount: record.cash_back_amount,
                    status_id: get(record, 'status.id', null),
                    [type]: value
                }
            })
        }
    }

    const handleStatus = (e) => {
        setStatus(e.target.value)
    }

    const columns = [
        {
            title: 'Truck No',
            dataIndex: "truckNo",
            width: '10%',
            render: (text, record) => get(record, 'truck.truck_no', null)
        },
        {
            title: 'Partner',
            dataIndex: "partner",
            width: '15%',
            render: (text, record) => <LinkComp data={get(record, 'partner.name', null)} id={get(record, 'partner.id', null)} />
        },
        {
            title: 'Phone No',
            dataIndex: "contact",
            width: '10%',
            render: (text, record) => <Phone number={get(record, 'partner.partner_users[0].mobile', null)}
                text={get(record, 'partner.partner_users[0].mobile', null)}
            />
        },
        {
            title: 'Expiry Date',
            dataIndex: "expiry",
            width: '10%',
            render: (text, record) => moment(get(record, 'truck.insurance_expiry_at', null)).format("YYYY-MM-DD")
        },
        {
            title: 'Status',
            dataIndex: "status",
            width: '10%',
            filterDropdown: (
                <Radio.Group
                    options={statusList}
                    defaultValue={status}
                    onChange={handleStatus}
                    className='filter-drop-down'
                />
            ),
            render: (text, record) => <InsuranceUpdate updateInsurance={updateInsurance}
                record={record}
                type="status_id"
                select
                options={statusList}
                edit_access={edit_access}
                text={get(record, 'status.name', "")} />
        },
        {
            title: 'Amount',
            dataIndex: "amount",
            width: '10%',
            render: (text, record) => <InsuranceUpdate updateInsurance={updateInsurance}
                record={record}
                type="amount"
                edit_access={edit_access}
                text={text ? text : 0} />
        },
        {
            title: 'Cash Back Amount',
            dataIndex: "cash_back_amount",
            width: '10%',
            render: (text, record) =>
                get(record, 'status.id') === 2 ?
                    <InsuranceUpdate updateInsurance={updateInsurance}
                        record={record}
                        type="cash_back_amount"
                        edit_access={edit_access}
                        text={text ? text : 0} /> : text
        },
        {
            title: "Last Comment",
            dataIndex: 'lastComment',
            width: '20%',
            render: (text, record) => get(record, 'last_comment[0].description', null)
        },
        {
            title: "",
            width: '3%',
            render: (text, record) =>
                <Tooltip title="Comment">
                    <Button
                        type="link"
                        icon={<CommentOutlined />}
                        onClick={() => handleShow("commentVisible", "Insurance Comment", 'commentData', record.id)}
                    />
                </Tooltip>
        }
    ]

    return (
        <>
            <Table
                columns={columns}
                dataSource={list}
                size="middle"
                loading={loading}
                pagination={false}
                rowKey={(record) => record.id}
            />
            {object.commentVisible &&
                <Modal
                    visible={object.commentVisible}
                    title={object.tittle}
                    onCancel={handleHide}>
                    <InsuranceComment
                        visible={object.commentVisible}
                        onHide={handleHide}
                        id={object.commentData} />
                </Modal>}
        </>
    )
}


export default Insurance