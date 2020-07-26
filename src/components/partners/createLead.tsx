
import { Modal, Button, Input, Row, Col, Space, Select } from 'antd'
import { OwnerName, SelectType } from '../../../mock/sourcing/createLead'

const { TextArea } = Input
const { Option } = Select

const CreateLead = (props) => {
  function handleChange (value) {
    console.log(`selected ${value}`)
  }
  const onChange = e => {
    console.log(e)
  }
  const { visible, onHide } = props

  const onSubmit = () => {
    console.log('data Transfered!')
    onHide()
  }
  return (
    <div>
      <Modal
        title='Create Lead'
        visible={visible}
        onOk={onSubmit}
        onCancel={onHide}
        footer={[
          <Button type='primary' key='back'> Submit </Button>
        ]}
      >
        <Input placeholder='Company Name' />
        <br />
        <br />
        <Input placeholder=' Name' />
        <br />
        <br />
        <Row>
          <Space>
            <Col>
              <Input placeholder='Phone' />
            </Col>
            <Col>
              <Select defaultValue='' style={{ width: 200 }} allowClear>
                <Option value=' '> </Option>
              </Select>
            </Col>
          </Space>
        </Row>
        <br />
        <Row>
          <Space>
            <Col>
              <Select defaultValue='Select Source' style={{ width: 200 }} onChange={handleChange} options={SelectType} />
            </Col>
            <Col>
              <Select defaultValue='Select Owner' style={{ width: 200 }} onChange={handleChange} options={OwnerName} />

            </Col>
          </Space>
        </Row>
        <br />
        <TextArea placeholder='Comment' allowClear onChange={onChange} />

      </Modal>
    </div>
  )
}

export default CreateLead
