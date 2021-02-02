
import { gql, useQuery, useMutation, useSubscription } from '@apollo/client'
import { useState, useContext } from 'react'

import { Modal, Form, Button, Input, Col, Row, Select ,message} from 'antd'
import React from 'react';
const { Option } = Select;
import now from 'lodash/now'
import get from 'lodash/get';
import isNaN from 'lodash/isNaN';
import isNil from 'lodash/isNil';
import Loading from '../../components/common/loading'


const GET_TOKEN = gql`
query getToken($ref_id: Int!, $process: String!) {
    token(ref_id: $ref_id, process: $process)
  }
`
const GET_ACTIVE_BANK = gql`query getbank_config${now()} {
    config_by_pk(key: "OUTGOING_BANK_TRANSFER") {
      value
    }
  }`

const INCOMING_TRANSFER = gql`
  mutation incoming_transfer($bank: String!, $process: String!, $token: String!) {
    incoming_transfer(bank: $bank, process: $process, token: $token) {
      description
      status
    }
  }
`




const IciciIncomingTransfer = (props) => {
    const {visible, onHide} = props

    const [form] = Form.useForm()
    const [account_details, setAccount_details] = useState({})
    const [amount, setAmount] = useState(0)


    console.log("in incoming component")

    let ref_id = 3434

    const { data, loading } = useQuery(GET_TOKEN, {
        fetchPolicy: 'network-only',
        variables: {
            ref_id: ref_id,
            process: 'INCOMING_OUTGOING_TRANSFER'
        }
    })
    const { data: bank_data, loading: bank_loading } = useQuery(GET_ACTIVE_BANK, {
        fetchPolicy: 'network-only'
    })

    let bank_details = [];
    if (!bank_loading) {
        bank_details = get(bank_data, 'config_by_pk.value', null)
    }

    let token = data && data.token

    const [incoming_transfer , { loading: transferLoading }] = useMutation(
        INCOMING_TRANSFER,
        {
            onError(error) { onHide(); message.success("Error while transferring payment") },
            onCompleted() {
                onHide()
                message.success("Transferred Successfully")
            }
        }
    )
    

    const onSubmit = () => {
        if (isNil(amount) || amount < 0) {
            console.log(" error")
            return
        }

        let bank = get(account_details, 'name', null)

        incoming_transfer(
            {
                variables: {
                    token,
                    process: 'INCOMING_OUTGOING_TRANSFER',
                    bank,
                    amount
                }
            }
        )

    }


console.log( amount)

    return (<>
        <Modal
            title='Transfer'
            visible={visible}
            onCancel={onHide}
            footer={[]} >

            <Form layout='vertical' form={form} onFinish={onSubmit}   >
                <Row gutter={10} >
                    <Col xs={12} sm={8} >
                        <Form.Item label='Bank' name='bank' extra = {`A/C No: ${account_details && account_details.account_no ? account_details.account_no : "" }`} >
                            <Select labelInValue onChange={(value) => setAccount_details({ account_no: value.value, name: value.label })}  >
                                {bank_details.map(bank => <Option value={bank.account_no} key={bank.name} >{bank.name}</Option>)}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={12} sm={8} >
                        <Form.Item label='Amount' name='amount' initialValue={0}  >
                            <Input type="number" min={0} onChange={(e) => setAmount(parseInt(e.target.value))} />
                        </Form.Item>
                    </Col>
                    <Col xs={12} sm={8} >
                        <Form.Item label='submit' className='hideLabel' >
                            
                            <Button type='primary' htmlType='submit' loading={loading } disabled={ isNaN(amount) || amount < 1} >
                                Transfer
                                </Button>

                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            {(loading || transferLoading) &&
        <Loading fixed />}

        </Modal>

    </>)
}

export default IciciIncomingTransfer
