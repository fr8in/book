import { message,Modal, Space } from 'antd'
import { gql, useQuery, useMutation } from '@apollo/client'
import InlineSelect from '../common/inlineSelect'
import get from 'lodash/get'
import userContext from '../../lib/userContaxt'
import { useContext } from 'react'
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
const UPDATE_CUSTOMER_ADVANCE_AMOUNT =gql`mutation update_customer_advance_amount($id:Int!,$customer_total_advance:Float!){
  update_trip(where:{id:{_eq:$id}},_set:{customer_total_advance:$customer_total_advance}){
    affected_rows
  }
}`
const UPDATE_CUSTOMER_ADVANCE_MUTATION = gql`
mutation customer_advance_update($description: String, $topic: String, $customer_id: Int, $created_by: String,$advance_percentage_id:Int,$updated_by:String!,$id:Int!,$customer_total_advance:Float!,$trip_id:Int!) {
  insert_customer_comment(objects: {description: $description, customer_id: $customer_id, topic: $topic, created_by: $created_by}) {
    returning {
      description
    }
  }
  update_customer(_set: {advance_percentage_id: $advance_percentage_id,updated_by:$updated_by}, where: {id: {_eq: $id}}) {
    returning {
      id
      advance_percentage_id
    }
  }
  update_trip(_set:{customer_total_advance:$customer_total_advance},where:{id:{_eq:$trip_id}}) {
    returning {
      id
    }
  }
}
`

const AdvanceEditModal = (props) => {
    const { visible, onHide, advanceData,customer_advance,customer_price,customer } = props
    const context = useContext(userContext)
    const { role,topic } = u
    const customerAdvancePercentageEdit = [role.admin, role.accounts_manager, role.accounts]

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
    const customer_advance_percentage = get(_data, 'customer_advance_percentage', [])
    const advancePercentageList = customer_advance_percentage.map(data => {
        return { value: data.id, label: data.name }
    })

    const customer_id = get(customer, 'id', null)
    const advancePercentage = get(customer, 'customer_advance_percentage.name', '-')
    const advancePercentageId = get(customer, 'customer_advance_percentage.id', null)
    
    const [updateCustomerTypeId] = useMutation(
        UPDATE_CUSTOMER_ADVANCE_MUTATION,
        {
          onError (error) { message.error(error.toString()) },
          onCompleted () { message.success('Updated!!') }
        }
      )
const [updateCustomerAmount] = useMutation(UPDATE_CUSTOMER_ADVANCE_AMOUNT,
  {
    onError (error) { message.error(error.toString()) },
    onCompleted () { message.success('Updated!!') }
  })
  const onSumbit = (value) => {
    updateCustomerAmount({
      variables:{
        id:advanceData,
        customer_total_advance:value
      }
    })
  }
    const onPercentageChange = (value) => {
      const percentageId = advancePercentageList.filter(data =>data.value === value)
      const percentage = get(percentageId[0],'label',0)
      const total_advance= (percentage/100)* customer_price
    console.log('checking',total_advance,value,customer_price)
        updateCustomerTypeId({
          variables: {
            customer_id: customer_id,
            updated_by: context.email,
            advance_percentage_id: value,
            created_by: context.email,
            description:`${topic.customer_advance_percentage} updated by ${context.email}`,
            topic:topic.customer_advance_percentage,
            id: customer_id,
            trip_id:advanceData,
            customer_total_advance:total_advance
          }
        })
      }
    return (
      <Modal
          title='CustomerAdvance'
          visible={visible}
          onCancel={onHide}
          footer={null}
        >
          <Space>
          <span>Advance Percentage</span>
           <span><InlineSelect
                label={advancePercentage}
                value={advancePercentageId}
                options={advancePercentageList}
                handleChange={(value) =>onPercentageChange(value)}
                style={{ width: '73%' }}
                edit_access={customerAdvancePercentageEdit}
            /></span>
            <span>Advance amount</span>
            <span><EditableCell
            label={customer_advance}
            onSubmit={(value) => onSumbit(value)}
            edit_access={customerAdvancePercentageEdit}
          /></span>
            </Space>
        </Modal>
    
    )
}

export default AdvanceEditModal