import { useState, useContext } from 'react'
import { Row, Col, Form, Input, Button, message, Modal } from 'antd'
import { gql, useMutation, useQuery, useLazyQuery } from '@apollo/client'
import get from 'lodash/get'
import userContext from '../../lib/userContaxt'
import u from '../../lib/util'
import sumBy from 'lodash/sumBy'

const GET_TOKEN = gql`query getToken($ref_id: Int!, $process: String!) {
    token(ref_id: $ref_id, process: $process)
  }
`

const CREATE_ADDITIONAL_ADVANCE_BANK = gql`
mutation create_additional_advance($input: AdditionalAdvanceBankInput) {
  additional_advance_bank(input: $input) {
    status
    description
    result {
        advance_result
    }
  }
}`

const IFSC_VALIDATION = gql`
query ifsc_validation($ifsc: String!){
  bank_detail(ifsc: $ifsc) {
    bank
    bankcode
    branch
  }
}`

const AdditionalAdvanceBank = (props) => {
    const { trip_info, setAdvanceRefetch, lock, radioValue } = props

    const [disableBtn, setDisableBtn] = useState(false)
    const [percentageCheck, setPercentageCheck] = useState(false)
    const [form] = Form.useForm()
    const context = useContext(userContext)
    const { role } = u
    const edit_access = [role.admin, role.rm, role.accounts_manager, role.bm]
    const access = u.is_roles(edit_access, context)

    const [getBankDetail, { loading, data, error }] = useLazyQuery(
        IFSC_VALIDATION,
        {
            onError(error) {
                message.error(`Invalid IFSC: ${error}`)
                form.resetFields(['ifsc'])
            },
            onCompleted(data) {
                message.success(`Bank name: ${get(bank_detail, 'bank', '')}!!`)
            }
        }
    )

    const { data: tokenData, loading: tokenLoading, refetch } = useQuery(GET_TOKEN, {
        fetchPolicy: "network-only",
        variables: {
            ref_id: trip_info.id,
            process: "ADDITIONAL_ADVANCE"
        }
    })
    let _data = {}
    if (!loading) {
        _data = data
    }

    let token = {}
    if (!tokenLoading) {
        token = tokenData ? tokenData.token : null
    }
    const bank_detail = get(_data, 'bank_detail', null)

    const onPercentageCheck = () => {
        setPercentageCheck(true)
    }

    const [createAdditionalAdvanceBank] = useMutation(
        CREATE_ADDITIONAL_ADVANCE_BANK,
        {
            onError(error) { message.error(error.toString()); setDisableBtn(false) },
            onCompleted(data) {
                const status = get(data, 'additional_advance_bank.status', null)
                const description = get(data, 'additional_advance_bank.description', null)
                const result = get(data, 'additional_advance_wallet.result.advance_result', null)
                form.resetFields()
                if (status === 'OK' && result === false) {
                    setDisableBtn(false)
                    setAdvanceRefetch(true)
                    message.success(description || 'Processed!')
                } else if (status === 'OK' && result === true) {
                    setTimeout(() => {
                        refetch()
                        onPercentageCheck()  
                        }, 2000)
                }
                else { (message.error(description)); setDisableBtn(false) }
                setTimeout(() => {
                    refetch()
                }, 2000)
            }
        }
    )
    const onSubmit = (form) => {
        setDisableBtn(true)
        if (lock === true) {
            message.error('previous Transaction Pending')
            setDisableBtn(false)
        } else {
            createAdditionalAdvanceBank({
                variables: {
                    input: {
                        trip_id: trip_info.id,
                        amount: parseFloat(form.amount),
                        wallet_code: trip_info && trip_info.partner && trip_info.partner.walletcode,
                        payment_mode: radioValue,
                        comment: form.comment,
                        created_by: context.email,
                        account_name: form.account_name,
                        account_number: form.account_number,
                        ifsc_code: form.ifsc,
                        token: token,
                        is_exception: percentageCheck ? true : false
                    }
                }
            })
        }
    }
    const rules = [
        {
            required: true,
            message: 'Confirm acccount number required!'
        },
        ({ getFieldValue }) => ({
            validator(rule, value) {
                if (!value || getFieldValue('account_number') === value) {
                    return Promise.resolve()
                }
                return Promise.reject('The account number that you entered do not match!')
            }
        })
    ]

    const validateIFSC = () => {
        if (form.getFieldValue('ifsc')) {
            getBankDetail({ variables: { ifsc: form.getFieldValue('ifsc') } })
        } else return null
    }

    console.log('IFSC validation Error', error)
    const onHandleOk = () => {
        onSubmit(form)
        setPercentageCheck(false)
    }
    const onHandleCancel = () => {
        setPercentageCheck(false)
    }

    const trip_status = get(trip_info, 'trip_status.id', null)
    const loadedNo = get(trip_info, 'loaded', 'No')
    const disable_adv_btn = (trip_status >= 12 || loadedNo === 'No' || !access)
    return (
        <>
            <Modal title="Basic Modal" visible={percentageCheck} onOk={onHandleOk} onCancel={onHandleCancel}>
                'Total advance percentage is more than 90%.
                Do you want to proceed?'
      </Modal>
            <div>
                <Form layout='vertical' form={form} onFinish={onSubmit}>
                    <Row gutter={10}>
                        <Col xs={12} sm={8}>

                            <Form.Item label='Account Name' name='account_name' rules={[{ required: true }]}>
                                <Input placeholder='Account Name' />
                            </Form.Item>
                        </Col>
                        <Col xs={12} sm={8}>
                            <Form.Item label='Account No' name='account_number' rules={[{ required: true }]}>
                                <Input placeholder='Account Number' />
                            </Form.Item>
                        </Col>
                        <Col xs={12} sm={8}>
                            <Form.Item label='Confirm Account No' rules={rules} dependencies={['account_number']} name='confirm'>
                                <Input placeholder='Confirm' type='password' />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={10}>
                        <Col xs={12} sm={8}>
                            <Form.Item label='IFSC Code' name='ifsc' extra={get(bank_detail, 'bank', null)} rules={[{ required: true, message: 'IFSC required!' }]}>
                                <Input placeholder='IFSC Code' onBlur={validateIFSC} />
                            </Form.Item>
                        </Col>
                        <Col xs={12} sm={8} className='reduceMarginTop1'>
                            <Form.Item label='Amount' name='amount' rules={[{ required: true }]}>
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
                            <Button type='primary' disabled={disable_adv_btn || (radioValue === 'BANK' && !form.getFieldValue('ifsc'))} loading={disableBtn || !token} htmlType='submit'>Pay Now</Button>
                        </Form.Item>
                    </Col>
                    </Row>
                </Form>
            </div>
        </>
    )
}

export default AdditionalAdvanceBank