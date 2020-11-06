import { Table,Modal,Tooltip } from 'antd'
import get from 'lodash/get'
import Link from 'next/link'
import Phone from '../common/phone'
import { gql, useQuery } from '@apollo/client'
import _ from 'lodash'

const PARTNER_TRIPS = gql`
query partner_trips($id:Int){
  trip(where: {id: {_eq: $id}}) {
    id
    partner_trips{
      count
    partner{
      id
      name
      partner_users{
        id
        mobile
      }
    }
    }
  }
}
`

const SuggestedPartners = (props) => {
 const { visible, onHide,trip_id } = props
 console.log('trip_id',trip_id)

 const { loading, error, data } = useQuery(
  PARTNER_TRIPS,
  {
    variables: { id: trip_id },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true
  }
)
console.log('PartnerTrips error',error)
let newData = {}
  if (!loading) {
    newData = {data}
  }
  const partner_trips = _.chain(newData).flatMap('trip').flatMap('partner_trips').value()

  const columns = [{
    title: 'Partner Name',
    dataIndex: 'partner',
    key: 'partner',
    width: '15%',
    render: (text, record) => {
      const cardcode = get(record, 'partner.cardcode', null)
      const name = get(record, 'partner.name', null)
      return (
        <Link href='/partners/[id]' as={`/partners/${cardcode} `}>
          {name && name.length > 12
            ? <Tooltip title={name}><a>{name.slice(0, 12) + '...'}</a></Tooltip>
            : <a>{name}</a>}
        </Link>)
    }
  },
  {
    title: 'Partner No',
    width: '15%',
    dataIndex: 'mobile',
    key: 'mobile',
    render: (text, record) =><Phone number={get(record, 'partner.partner_users[0].mobile', '-')} />
  },
  {
    title: 'Loads',
    dataIndex: 'count',
    key: 'count',
    width: '15%'
  }
  ]

  return (
    <>
    <Modal
      title='Suggested Partners'
      visible={visible}
      onCancel={onHide}
      width={800}
      style={{top:2}}
      footer={null}
    >
      <Table
        columns={columns}
        dataSource={partner_trips}
        rowKey={record => get(record, 'id', null)}
        size='small'
        scroll={{ x: 700,y:420 }}
        pagination={false}
        className='withAction'
      />
      </Modal>
    </>
  )
}

export default SuggestedPartners
