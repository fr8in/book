
import { Row, Col, Card, Input,Button, Form,Divider,Space,Select,InputNumber} from 'antd';

const { Option } = Select;

function handleChange(value) {
  console.log(`selected ${value}`);
}
function onChange(value) {
    console.log('changed', value);
  }
  
function AddTruck() {
    return (
        <div>
           <h1> Savdesh Kumar</h1> 
            <Divider />
            
            <br />
            <br />
            <Card title="Truck Detail">
                <Form layout='vertical'>
                <Row gutter={10}>
                    <Col sm={5}>
                            <Form.Item
                                label="Truck Number"
                                name="Truck Number"
                                rules={[{ required: true, message: 'Truck Number is required field!' }]}
                            >
                                <Input placeholder="Truck Number" />
                            </Form.Item> 
                    </Col>
                    <Col  sm={5}>
                        
                            <Form.Item
                                label="Current City"
                                name="Current City"
                                rules={[{ required: true, message: 'Current City is required field!' }]}
                            >
                                <Select defaultValue="Current City"  onChange={handleChange}>
                                    </Select>
                            </Form.Item>
                    </Col>
                    <Col  sm={5}>
                       
                            <Form.Item
                                label="Driver Number"
                                name="Driver Number"
                                rules={[{ required: true, message: 'Driver Number is required field' }]}
                            >
                                <Input placeholder="Driver Number" />
                            </Form.Item> 
                    </Col>
                    </Row>

                    <Row gutter={[12, 12]}>
                    <Col  sm={5}>
                        
                            <Form.Item
                                label="Truck Type"
                                name="Truck Type"
                                rules={[{ required: true, message: 'Truck Type is required field' }]}
                            >
                               <Select defaultValue="Truck Type"  onChange={handleChange}>
                                    <Option value="32 Feet Multi Axle">32 Feet Multi Axle</Option>
                                    <Option value="23 Feet Single Axle">23 Feet Single Axle</Option>
                                    <Option value="10 Whl" > 10 Whl </Option>                                   
                                    <Option value="12 Whl">12 Whl</Option>
                                    </Select>
                            </Form.Item> 
                    </Col>
                    <Col  sm={2}>
                        
                            <Form.Item
                                label="Length(Ft)"
                                name="Length(Ft)"
                                rules={[{ required: true, message: 'Length(Ft) is required field' }]}
                            >
                               <InputNumber min={1} max={100}    onChange={onChange} placeholder="Length(Ft)"/>
                            </Form.Item> 
                    </Col>
                    <Col  sm={2}>
                        
                            <Form.Item
                                label="Breadth(Ft)"
                                name="Breadth(Ft)"
                                rules={[{ required: true, message: 'Breadth(Ft) is required field' }]}
                            >
                                <InputNumber min={1} max={100}  onChange={onChange} placeholder="Breadth(Ft)" />
                            </Form.Item> 
                    </Col>
                    <Col  sm={2}>
                        
                            <Form.Item
                                label="Height(Ft)"
                                name="Height(Ft)"
                                rules={[{ required: true, message: 'Height(Ft) is required field' }]}
                            >
                                <InputNumber min={1} max={100}  onChange={onChange} placeholder="Height(Ft)" />
                            </Form.Item> 
                    </Col>
                    </Row>
                    </Form>
            </Card> 
            <br />
            <Row justify="end" className="m5">
                <Space>
               
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
               
                    <Button >
                        Cancel
                    </Button>
               </Space>
            </Row>
            </div>
    )
}

export default AddTruck