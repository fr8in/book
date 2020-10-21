import { Row, Col, Form, DatePicker, Checkbox } from 'antd'
import CitySelect from '../common/citySelect'
import Loading from '../common/loading'
import Driver from '../partners/driver'
import get from 'lodash/get'
import LoadingPointContact from './loadingPointContact'

const PoDetail = (props) => {
  const { po_data, onSourceChange, onDestinationChange, loading_contact_id, driver_id, customer, loading, record } = props

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
            <LoadingPointContact customer={customer} onUserChange={loading_contact_id} />
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
