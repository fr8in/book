import { Modal, Row, Button, Form, Input, Col, Select, DatePicker, Space, Radio } from 'antd';
import {createPO,customer} from '../../../mock/customer/createQuickPo'


const {Option} = Select;
function handlechange(value){
    console.log(`Selected ${value}`);
}
const CustomerPo = (props) => {
    const { visible, onHide } = props

    const onSubmit = () => {
        console.log('Customer PO is Created!')
        onHide()
    }
    function onChange(date, dateString) {
        console.log(date, dateString);
    }
    
    return (
        <Modal
            visible={props.visible}
            title='PO:Irshad Akhtar khan'
            onOk={onSubmit}
            onCancel={props.onHide}
            width={900}
            footer={[
                <Button key='back' onClick={props.onHide}>
                    Cancel
            </Button>,
                <Button
                    key='OK'
                    type='primary'
                    onClick={onSubmit}
                >Create
            </Button>
            ]}
        >
            <Form layout='vertical'>
                <Row gutter={10}>
                    <Col xs={18}>
                        <Form.Item label='Customer'>
                            <Select
                                placeholder='Customer'
                                onChange={handlechange}
                               options={customer}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={6}>TN36A2212</Col>
                </Row>
                <Row gutter={10}>
                    <Col xs={6}>
                        <Form.Item label='PO Date'>
                            <DatePicker onChange={onChange} />
                        </Form.Item>
                    </Col>
                    <Col xs={6}>
                        <Form.Item label='Loading Point Contact'>
                            <Input
                                placeholder='loadingPointContact'
                                disabled={false}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={6}>
                        <Form.Item label='Source'>
                            <Select
                                onChange={handlechange}
                                options={createPO}
                                
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={6}>
                        <Form.Item label='Destination'>
                            <Select
                               onChange={handlechange}
                               options={createPO}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <br></br>
                <Row>
                    <Radio>Rate/Trip</Radio> <Space>
                        <Radio>Rate/Ton</Radio>
                    </Space>
                </Row>
                <br></br>
                <Row gutter={10}>
                    <Col xs={6}>
                        <Form.Item label='Customer Price'>
                            <Input
                                placeholder='customerPrice' 
                                disabled={false}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={6}>
                        <Form.Item label='Mamul Charge'>
                            <Input
                                placeholder='0'
                                disabled={false}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={6}>
                        <Form.Item label='Net Price'>
                            <Input
                                placeholder='Net Price'
                                disabled={false}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={6}>
                        <p>Including:</p>
                        <Radio>Loading</Radio> <Space>
                            <Radio>Unloading</Radio></Space>
                    </Col>
                </Row>
                <Row>
                    <Col span={3}>Advance%:90</Col>
                    <Col span={3} offset={3}>System Mamul:0</Col>
                </Row>
                <br></br>
                <Row gutter={20}>
                    <Col xs={6}>
                        <Form.Item label='Bank'>
                            <Input
                                placeholder='Bank'
                                disabled={false}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={6}>
                        <Form.Item label='Cash'>
                            <Input
                                placeholder='Cash'
                                disabled={false}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={6}>
                        <Form.Item label='To-price'>
                            <Input
                                placeholder='To-Price'
                                disabled={false}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={6}>
                        <Form.Item label='Driver Number'>
                            <Input
                                placeholder='Driver Number'
                                disabled={false}
                            />
                        </Form.Item>
                        </Col>
                        </Row>
                        <Row >
                            <Col span={4}>Partner₹:</Col>
                            <Col span={4}>Adv-70%:</Col>
                            <Col span={4}>Wallet:</Col>
                            <Col span={4}>Cash:</Col>
                            <Col span={4}>To-Pay:</Col>
                        </Row> 
                     </Form>
                </Modal>
    )
}

export default CustomerPo

