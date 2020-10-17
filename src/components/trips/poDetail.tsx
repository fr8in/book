import { Row, Col, Form, DatePicker, Checkbox, Select } from 'antd'
import CitySelect from '../common/citySelect'
import Loading from '../common/loading'
import Driver from '../partners/driver'
import get from 'lodash/get'

const PoDetail = (props) => {
  const { po_data, onSourceChange, onDestinationChange, driver_id, customer, loading, record } = props

  const customer_user = get(customer, 'customer_users', [])

  const customer_user_list = customer_user.map((data) => {
    return { value: data.id, label: `${data.name.slice(0, 10)} - ${data.mobile}` }
  })

  return (
    loading ? <Loading /> : (
      <>
        <Row gutter={20}>
          <Col xs={24} sm={24}>
            <Form.Item
              label='PO Date'
              name='po_date'
              rules={[{ required: true }]}
            >
              <DatePicker style={{ width: '100%' }} size='small' />
            </Form.Item>
            <CitySelect
              label='Source'
              onChange={onSourceChange}
              required
              name='source'
              city={get(record, 'source.name', null)}
              size='small'
            />
            <CitySelect
              label='Destination'
              onChange={onDestinationChange}
              required
              name='destination'
              city={get(record, 'destination.name', null)}
              size='small'
            />
            <Form.Item label='Loading Point Contact' name='loading_contact' rules={[{ required: true }]}>
              <Select
                placeholder='Customer contact...'
                options={customer_user_list}
                optionFilterProp='label'
                showSearch
                size='small'
              />
            </Form.Item>
            <Driver partner_id={po_data.id} driver_id={driver_id} required size='small' />
            <Form.Item label='Including' initialValue='' name='charge_inclue' labelCol={{ sm: 4 }} wrapperCol={{ sm: 20 }}>
              <Checkbox.Group>
                <Checkbox value='Loading'>Loading</Checkbox>
                <Checkbox value='Unloading'>Unloading</Checkbox>
              </Checkbox.Group>
            </Form.Item>
          </Col>
        </Row>
      </>)
  )
}

export default PoDetail
