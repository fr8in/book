
import { Modal, Button, Input, Form, Row, Col, Select } from 'antd'
import CitySelect from '../common/citySelect'

const Option = Select
const CreateExcessLoad = (props) => {
  const onSubmit = () => {
    console.log('Excess Load create button Clicked!!')
  }

  const onCityChange = (city_id) => {
    console.log('City ID', city_id)
  }

  return (
    <Modal
      visible={props.visible}
      title='Create Excess Load'
      onOk={onSubmit}
      onCancel={props.onHide}
      footer={[
        <Button key='back' onClick={props.onHide}>
              Cancel
        </Button>,
        <Button
          key='Create'
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
                disabled={false}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col xs={12}>
            <CitySelect
              label='Source'
              onChange={() => console.log}
            />
          </Col>
          <Col xs={12}>
            <CitySelect
              label='Destination'
              onChange={onCityChange}
              disabled={false}
            />
          </Col>
        </Row>
        <Row gutter={10}>
          <Col xs={6}>
            <Form.Item label='Price'>
              <Input
                placeholder='Price'
                disabled={false}
              />
            </Form.Item>
          </Col>
          <Col xs={6}>
            <Form.Item label='Ton'>
              <Input
                placeholder='Ton'
                disabled={false}
              />
            </Form.Item>
          </Col>
          <Col xs={12}>
            <Form.Item label='Truck Type'>
              <Select defaultValue='32 Feet Multi Axle'>
                <Option value='32 Feet Multi Axle'>32 Feet Multi Axle</Option>
                <Option value='32 Feet Single Axle'>32 Feet Single Axle</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={20}>
          <Col xs={24}>
            <Form.Item label='Comments'>
              <Input
                placeholder='Please enter Material Type or Tons'
                disabled={false}
                type='textarea'
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default CreateExcessLoad
