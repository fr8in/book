import { Row, Col, Modal, Form, Button, Input, message, Table, Tooltip } from 'antd'
import { gql, useMutation, useSubscription } from '@apollo/client'
import moment from 'moment'
import { useContext, useState } from 'react'
import userContext from '../../lib/userContaxt'
import get from 'lodash/get'

const INSURANCE_COMMENT = gql`subscription insurance_comment($insurance_id: Int!) {
    insurance(where: {id: {_eq: $insurance_id}}) {
      status {
        id
        name
      }
      comments {
        id
        insurance_id
        topic
        description
        created_at
        created_by
        updated_at
      }
    }
  }    
`
const INSERT_INSURANCE_COMMENT_MUTATION = gql`mutation create_insurance_comment($insurance_id: Int, $description: String, $created_at: timestamp, $created_by: String,$topic:String) {
    insert_insurance_comment(objects: {insurance_id: $insurance_id, topic:$topic, description: $description, created_at: $created_at, created_by: $created_by}) {
      affected_rows
    }
  }`
const InsuranceComment = (props) => {
    const { visible, onHide, id } = props

    const [form] = Form.useForm()
    const context = useContext(userContext)
    const [disableButton, setDisableButton] = useState(false)

    const { loading, data, error } = useSubscription(
        INSURANCE_COMMENT, { variables: { insurance_id: id } }
    )

    console.log("insurance comment", data, error)
    let comments = []
    if (!loading) {
        comments = get(data, 'insurance[0].comments', [])
    }

    const [insertComment] = useMutation(
        INSERT_INSURANCE_COMMENT_MUTATION,
        {
            onError(error) {
                setDisableButton(false)
                message.error(error.toString())
            },
            onCompleted() {
                setDisableButton(false)
                message.success('Updated!!')
                form.resetFields()
                onHide()
            }
        }
    )

    const onSubmit = (form) => {
        setDisableButton(true)
        insertComment({
            variables: {
                insurance_id: id,
                created_by: context.email,
                description: form.comment,
                topic: get(data, 'insurance[0].status.name', "")
            }
        })
    }

    const columns = [{
        title: 'Comments',
        dataIndex: 'description',
        width: '40%',
        render: (text, record) => {
            return (
                text && text.length > 20 ? <Tooltip title={text}><span>{text.slice(0, 20) + '...'}</span></Tooltip> : text
            )
        }
    },
    {
        dataIndex: 'created_by',
        width: '30%'
    },
    {
        dataIndex: 'created_at',
        width: '30%',
        render: (text, record) => {
            return text ? moment(text).format('DD-MMM-YY') : null
        }
    }]

    return (
        <>
            <Modal
                title='Add Comment'
                visible={visible}
                onCancel={onHide}
                footer={[]}
            >
                <Form onFinish={onSubmit} form={form}>
                    <Row gutter={10} className='mb10'>
                        <Col flex='auto'>
                            <Form.Item name='comment'>
                                <Input.TextArea
                                    placeholder='Please Enter Comments......'
                                />
                            </Form.Item>
                        </Col>
                        <Col flex='80px'>
                            <Form.Item>
                                <Button type='primary' loading={disableButton} htmlType='submit'>Submit</Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <Table
                    columns={columns}
                    dataSource={comments}
                    rowKey={record => record.id}
                    size='small'
                    pagination={false}
                />
            </Modal>
        </>
    )
}

export default InsuranceComment
