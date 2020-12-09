import { useEffect } from 'react'
import { Table } from 'antd'
import { gql, useSubscription } from '@apollo/client'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

const ADDITIONAL_ADVANCE_QUERY = gql`subscription additional_advance($trip_id: Int_comparison_exp!) {
  advance_additional_advance(where: {trip_id: $trip_id}) {
    id
    trip_id
    amount
    comment
    created_at
    created_by
    payment_mode
    status
  }
}`

const EXCESS_ADVANCE_QUERY = gql`subscription excess_advance($trip_id: Int_comparison_exp!) {
  advance_excess_advance(where: {status: {_eq: "COMPLETED"}, trip_id: $trip_id}) {
    id
    trip_id
    amount:eligible_advance
    comment
    created_at
    created_by
    status
  }
}
`

const AdditionalAdvance = (props) => {
  const { loaded, ad_trip_id, advanceRefetch, setAdvanceRefetch } = props
  const { loading, error, data } = useSubscription(
    ADDITIONAL_ADVANCE_QUERY, {
    variables: { trip_id: { _eq: ad_trip_id } }
  })

  const { loading: excessLoading, error: excessError, data: excessData } = useSubscription(
    EXCESS_ADVANCE_QUERY, {
    variables: { trip_id: { _eq: ad_trip_id } }
  })

  console.log('Additional advance error', error, data, excessLoading,excessError, excessData)

  var _data = {}
  if (!loading) {
    _data = data
  }
  let _excessData = {}
  if (!excessLoading) {
    _excessData = excessData
  }
  useEffect(() => {
    if (advanceRefetch) {
      setAdvanceRefetch(false)
    }
  }, [advanceRefetch])

  const additionalAdvance = get(_data, 'advance_additional_advance', [])
  const excessAdvance = get(_excessData, 'advance_excess_advance', [])
  const list = [...additionalAdvance, ...excessAdvance]
  
  const columns = [
    {
      title: 'Type',
      dataIndex: 'payment_mode',
      width: '8%',
      render:(text)=>text ? text : "WALLET"
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      width: '10%'
    },
    {
      title: 'Reason',
      dataIndex: 'comment',
      width: '24%'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: '12%'
    },
    {
      title: 'Created By',
      dataIndex: 'created_by',
      width: '22%'
    },
    {
      title: 'Created On',
      dataIndex: 'created_at',
      //render: (text, record) => (text ? text).format('DD-MMM-YY') : '-'),
      width: '14%'
    }
  ]
  return (
    <div className='additonalAdv'>
      {!isEmpty(additionalAdvance) || !isEmpty(excessAdvance)? (
        <Table
          columns={columns}
          dataSource={list}
          rowKey={record => record.id}
          size='small'
          scroll={{ x: 960 }}
          pagination={false}
        />)
        : !(loaded) ? <p>Additional advance available after process advance</p>
          : <p>Additional advance not processed</p>}
    </div>
  )
}

export default AdditionalAdvance
