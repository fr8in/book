import { message } from 'antd'
import { gql, useQuery, useMutation } from '@apollo/client'
import InlineSelect from '../common/inlineSelect'
import get from 'lodash/get'
import userContext from '../../lib/userContaxt'
import u from '../../lib/util'
import { useContext } from 'react'

const PARTNER_ADVANCE_PERCENTAGE_SUBSCRIPTION = gql`
  query partner_advance_percentage{
   partner_advance_percentage{
    id
    name
  }
}
`
const UPDATE_PARTNER_ADVANCE_PERCENTAGE_MUTATION = gql`
mutation partner_advance_percentage_mutation($description:String, $topic:String, $partner_id: Int,$updated_by: String!,$partner_advance_percentage_id:Int,$cardcode:String!){
  insert_partner_comment(objects:{partner_id:$partner_id,topic:$topic,description:$description,created_by:$updated_by})
    {
      returning
      {
        id
      }
    }
update_partner(_set:{partner_advance_percentage_id:$partner_advance_percentage_id,updated_by:$updated_by }, where:{cardcode:{_eq:$cardcode}}){
    returning{
      id
      partner_advance_percentage_id
    }
  }
}
`
const AdvancePercentage = (props) => {
  const { advance_id, advance, cardcode, edit_access ,partner_id} = props
  const { topic } = u
  const context = useContext(userContext)

  const { loading, error, data } = useQuery(
    PARTNER_ADVANCE_PERCENTAGE_SUBSCRIPTION,
    {
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )
  console.log('advancePercentage error', error)

  const [UpdateAdvancePercentage] = useMutation(
    UPDATE_PARTNER_ADVANCE_PERCENTAGE_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )

  let _data = {}
  if (!loading) {
    _data = data
  }
  const partner_advance_percentage = get(_data, 'partner_advance_percentage', [])

  const advancePercentage = partner_advance_percentage.map(data => {
    return { value: data.id, label: data.name }
  })

  const onChange = (value) => {
    UpdateAdvancePercentage({
      variables: {
        cardcode,
        partner_advance_percentage_id: value,
        updated_by: context.email,
        description:`${topic.partner_advance_percentage} updated by ${context.email}`,
        topic:topic.partner_advance_percentage,
        partner_id: partner_id
      }
    })
  }

  return (
    loading ? null : (
      <InlineSelect
        label={advance}
        value={advance_id}
        options={advancePercentage}
        handleChange={onChange}
        style={{ width: 110 }}
        edit_access={edit_access}
      />)
  )
}

export default AdvancePercentage
