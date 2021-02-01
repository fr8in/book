
import { gql, useQuery, useMutation, useSubscription } from '@apollo/client'
import { useState, useContext } from 'react'

import { Modal, Form, Button, Input, Col, Row, Select } from 'antd'
import LabelWithData from '../common/labelWithData'
import React from 'react';
const { Option } = Select;
import now from 'lodash/now'
import get from 'lodash/get';


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




const IciciIncomingTransfer = (visible, onHide) => {

    const [form] = Form.useForm()
    const [account_no, setAccount_no] = useState({})


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
    console.log("token  ", token)

    console.log("bank_details  ", bank_details)

    console.log("bank_loading  ", bank_loading)



    const onSubmit = (form) => {

        console.log("transfer clicked  ", form.bank.value, form.amount)

    }




    return (<>
        <Modal
            title='Transfer'
            visible={visible}
            onCancel={onHide}
            footer={[]} >

            <Form layout='vertical' form={form} onFinish={onSubmit}   >
                <Row gutter={10} >
                    <Col xs={12} sm={8} >
                        <Form.Item label='Bank' name='bank'  >
                            <Select labelInValue onChange={(value) =>{ console.log(value) } }  >
                                {bank_details.map(bank => <Option value={bank.name} >{bank.name}</Option>)}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={12} sm={8} >
                        <Form.Item label='Amount' name='amount' initialValue={0}  >
                            <Input type="number" />
                        </Form.Item>
                    </Col>
                    <Col xs={12} sm={8} >
                        <Form.Item label='submit' className='hideLabel' >
                            <Button type='primary' htmlType='submit' loading={loading} >
                                Transfer
              </Button>
                        </Form.Item>

                        <Form.Item  >
                            <LabelWithData label='A/C No:' data={"sas"} labelSpan={10} dataSpan={14} />
                        </Form.Item>

                    </Col>
                </Row>


            </Form>
        </Modal>

    </>)
}

export default IciciIncomingTransfer
