import { useState, useContext } from 'react'
import { Row, Col, Form, Input, Button, message, Modal } from 'antd'
import { gql, useMutation, useQuery } from '@apollo/client'
import get from 'lodash/get'
import userContext from '../../lib/userContaxt'
import u from '../../lib/util'
import Loading from '../common/loading'

const GET_TOKEN = gql`
 query getToken($ref_id: Int!, $process: String!) {
    token(ref_id: $ref_id, process: $process) 
 } 
`

const CREATE_ADDITIONAL_ADVANCE_WALLET = gql`
  mutation create_additional_advance($input: AdditionalAdvanceWalletInput) {
    additional_advance_wallet(input: $input) {
      status
      description
      result {
          advance_result
      }
    }
  }
`

const AdditionalAdvanceWallet = (props) => {
    const { trip_info, lock, radioValue } = props

    const [disableBtn, setDisableBtn] = useState(false)
    const [percentageCheck, setPercentageCheck] = useState(false)
    const [form] = Form.useForm()
    const context = useContext(userContext)
    const { role } = u
    const edit_access = [role.admin, role.rm, role.accounts_manager, role.bm, role.operations]
    const access = u.is_roles(edit_access, context)

    const { data, loading, refetch } = useQuery(GET_TOKEN, {
        fetchPolicy: "network-only",
        variables: {
            ref_id: trip_info.id,
            process: "ADDITIONAL_ADVANCE"
        }
    })
    let token = {}
    if (!loading) {
        token = get(data, 'token', null)

    }

    const onPercentageCheck = () => {
        setPercentageCheck(true)
    }
    const [createAdditionalAdvanceWallet] = useMutation(
        CREATE_ADDITIONAL_ADVANCE_WALLET,
        {
            onError(error) { message.error(error.toString()); setDisableBtn(false) },
            onCompleted(data) {
                const status = get(data, 'additional_advance_wallet.status', null)
                const description = get(data, 'additional_advance_wallet.description', null)
                const result = get(data, 'additional_advance_wallet.result.advance_result', null)
                if (status === 'OK' && result === false) {
                    setDisableBtn(false)
                    form.resetFields()
                    message.success(description || 'Processed!')
                } else if (status === 'OK' && result === true) {
                    // getting token after 2s and proceeding additional advance
                    setTimeout(() => {
                        onPercentageCheck() 
                    }, 3000)
                }
                else { (message.error(description)); setDisableBtn(false) }
                // refetch the token after every call
                setTimeout(() => {
                    refetch()
                }, 2000)
            }
        }
    )
    const onSubmit = (form) => {
        setDisableBtn(true)
        setPercentageCheck(false)
        if (lock) {
            message.error('previous Transaction Pending')
            setDisableBtn(false)
        }else if (!token) {
           message.error('Secured token not created contact FR8 team')
        }
        else {
            createAdditionalAdvanceWallet({
                variables: {
                    input: {
                        trip_id: trip_info.id,
                        amount: parseFloat(form.amount),
                        wallet_code: get(trip_info,'partner.walletcode',null),
                        payment_mode: radioValue,
                        comment: form.comment,
                        created_by: context.email,
                        token: token,
                        is_exception: percentageCheck ? true : false
                    }
                }
            })
        }
    }

    const onHandleOk = () => {
        form.submit()
    }
    const onHandleCancel = () => {
        setPercentageCheck(false)
        setDisableBtn(false)
    }
    const trip_status = get(trip_info, 'trip_status.id', null)
    const loaded = get(trip_info, 'loaded', null)
    const disable_adv_btn = (trip_status >= 12 || loaded === 'No' || !access)
    return (
        <>
            <Modal
                visible={percentageCheck}
                onOk={onHandleOk}
                onCancel={onHandleCancel}
            >
               <p>Total advance percentage is more than 90%.
                Do you want to proceed?</p>
         </Modal>
            <Form layout='vertical' form={form} onFinish={onSubmit}>
                <Row gutter={10}>
                    <Col xs={12} sm={8}>
                        <Form.Item label='Amount' name='amount' extra='*Limit PO value' rules={[{ required: true }]}>
                            <Input placeholder='Amount' />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={10}>
                    <Col xs={16}>
                        <Form.Item label='Comment' name='comment' rules={[{ required: true }]}>
                            <Input placeholder='Comment' />
                        </Form.Item>
                    </Col>
                    <Col xs={8}>
                        <Form.Item label='save' className='hideLabel'>
                            <Button type='primary' disabled={disable_adv_btn} loading={disableBtn || !token} htmlType='submit'>Pay Now</Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            {disableBtn &&
                  <Loading fixed />}
        </>
    )
}

export default AdditionalAdvanceWallet