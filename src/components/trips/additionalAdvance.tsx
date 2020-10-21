import { useEffect } from 'react'
import { Table } from 'antd'
import { gql, useQuery } from '@apollo/client'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

const ADDITIONAL_ADVANCE_QUERY = gql`
query additional_advance($trip_id: Int_comparison_exp!) {
  trip(where: {id: $trip_id}) {
    additional_advance {
      id
      trip_id
      amount
      comment
      created_by
      created_on
      payment_mode
      status
    }
  }
}`

const AdditionalAdvance = (props) => {
  const { loaded, ad_trip_id, advanceRefetch, setAdvanceRefetch } = props
  const { loading, error, data, refetch } = useQuery(
    ADDITIONAL_ADVANCE_QUERY, {
      variables: { trip_id: { _eq: ad_trip_id } },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    })

  console.log('Additional advance error', error)

  var _data = {}
  if (!loading) {
    _data = data
  }

  useEffect(() => {
    if (advanceRefetch) {
      refetch()
      setAdvanceRefetch(false)
    }
  }, [advanceRefetch])

  const additionalAdvance = get(_data, 'trip[0].additional_advance', [])

  const columns = [
    {
      title: 'Type',
      dataIndex: 'payment_mode',
      width: '8%'
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      width: '10%'
    },
    {
      title: 'Reason',
      dataIndex: 'comment',
      width: '34%'
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
      dataIndex: 'created_on',
      render: (text, record) => {
        return text
      },
      width: '14%'
    }
  ]
  return (
    <div className='additonalAdv'>
      {!isEmpty(additionalAdvance) ? (
        <Table
          columns={columns}
          dataSource={additionalAdvance}
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
