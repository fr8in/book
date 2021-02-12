import { message, Modal, Row, Col,Alert } from 'antd';
import { gql, useQuery, useMutation } from '@apollo/client'
import InlineSelect from '../common/inlineSelect'
import get from 'lodash/get'
import u from '../../lib/util'
import EditableCell from '../common/editableCell';

const CUSTOMERS_ADVANCE_PERCENTAGE_QUERY = gql`
  query customer_advance_percentage{
  customer_advance_percentage{
    id
    name
  }
}
`
const UPDATE_CUSTOMER_ADVANCE_AMOUNT = gql`mutation update_customer_advance_amount($id:Int!,$customer_total_advance:Float!){
  update_trip(where:{id:{_eq:$id}},_set:{customer_total_advance:$customer_total_advance}){
    affected_rows
  }
}`
const UPDATE_CUSTOMER_ADVANCE_MUTATION = gql`
mutation customer_advance_update($customer_advance_percentage:Int,$customer_total_advance:Float!,$trip_id:Int!) {
  update_trip(_set:{customer_total_advance:$customer_total_advance,customer_advance_percentage:$customer_advance_percentage},where:{id:{_eq:$trip_id}}) {
    returning {
      id
    }
  }
}
`

const AdvanceEditModal = (props) => {
  const { visible, onHide, advanceData, trip } = props
  const customer_advance = get(trip, 'customer_total_advance', 0)
  const customer_price = get(trip, 'customer_price', 0)
  const customer_advance_percentage = get(trip, 'customer_advance_percentage', 0)

  const { role } = u
  const customerAdvancePercentageEdit = [role.user]

  const { loading, error, data } = useQuery(
    CUSTOMERS_ADVANCE_PERCENTAGE_QUERY,
    {
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )
  let _data = {}
  if (!loading) {
    _data = data
  }
  const advance_percentage = get(_data, 'customer_advance_percentage', [])
  const advancePercentageList = advance_percentage.map(data => {
    return { value: data.id, label: data.name }
  })

  const [updateCustomerTypeId] = useMutation(
    UPDATE_CUSTOMER_ADVANCE_MUTATION,
    {
      onError(error) { message.error(error.toString()) },
      onCompleted() { message.success('Updated!!') }
    }
  )
  const [updateCustomerAmount] = useMutation(UPDATE_CUSTOMER_ADVANCE_AMOUNT,
    {
      onError(error) { message.error(error.toString()) },
      onCompleted() { message.success('Updated!!') }
    })
  const onSumbit = (value) => {
    updateCustomerAmount({
      variables: {
        id: advanceData,
        customer_total_advance: value
      }
    })
  }
  const onPercentageChange = (value) => {
    const percentageId = advancePercentageList.filter(data => data.value === value)
    const percentage = get(percentageId[0], 'label', 0)
    const total_advance = (percentage / 100) * customer_price
    updateCustomerTypeId({
      variables: {
        trip_id: advanceData,
        customer_total_advance: total_advance,
        customer_advance_percentage: percentage
      }
    })
  }
  return (
    <Modal
      title='Customer Advance'
      visible={visible}
      onCancel={onHide}
      footer={null}
    >
      <Row gutter={10}>
     <Alert
      message=''
      description="Customer Advance changes  will be applicable for FR-memo and Partner-memo"
      type="info"
      showIcon
    /></Row>
    <br />
      <Row>
        <Col span={8}>
          <p>Advance Percentage </p></Col>
        <Col span={4}>
          <InlineSelect
            label={customer_advance_percentage}
            value={customer_advance_percentage}
            options={advancePercentageList}
            handleChange={(value) => onPercentageChange(value)}
            style={{ width: '73%' }}
            edit_access={customerAdvancePercentageEdit}
          />
        </Col>
        <Col span={6}>
          <p>Advance amount </p></Col>
        <Col span={6}>
          <EditableCell
            label={customer_advance}
            onSubmit={(value) => onSumbit(value)}
            edit_access={customerAdvancePercentageEdit}
            width={50}
          /></Col>
      </Row>
    </Modal>

  )
}

export default AdvanceEditModal