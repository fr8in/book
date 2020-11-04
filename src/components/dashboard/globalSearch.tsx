import { useState } from 'react'
import { Drawer, Input, Collapse } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { gql, useQuery } from '@apollo/client'
import Loading from '../common/loading'
import LabelAndData from '../common/labelAndData'
import Link from 'next/link'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

const { Panel } = Collapse

const GLOBAL_SEARCH = gql`
query search($search:String){
  search_partner(args: {search: $search}) {
    id
    link
    description
  }
  search_customer(args: {search: $search}) {
    id
    link
    description
  }
  search_truck(args: {search: $search}) {
    id
    link
    description
  }
  search_trip(args: {search: $search}) {
    id
    link
    description
  }
  search_lead(args:{search:$search}){
    id
    link
    description
  }
}
`
const GlobalSearch = (props) => {
  const { visible, onHide } = props
  const [search, setSearch] = useState(null)

  const { loading, error, data } = useQuery(
    GLOBAL_SEARCH,
    {
      variables: { search: search },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )

  var _data = {}
  if (!loading) {
    _data = data
  }
  const customer = get(_data, 'search_customer', [])
  const partner = get(_data, 'search_partner', [])
  const trip = get(_data, 'search_trip', [])
  const truck = get(_data, 'search_truck', [])
  const lead = get(_data, 'search_lead', [])

  console.log('GlobalSearch Error', error)

  const onSearch = (e) => {
    setSearch(e.target.value)
  }
  const no_data = (isEmpty(customer) && isEmpty(partner) && isEmpty(trip) && isEmpty(truck) && isEmpty(lead))
  const activekey = !isEmpty(truck) ? '4' : !isEmpty(partner) ? '2' : !isEmpty(customer) ? '1' : !isEmpty(trip) ? '3' : '5'
  return (
    <Drawer
      title={<Input placeholder='Search...' prefix={<SearchOutlined />} onChange={onSearch} />}
      placement='right'
      closable={false}
      onClose={onHide}
      visible={visible}
      bodyStyle={{ padding: 0 }}
    >
      {loading ? <Loading /> : no_data ? (
        <div className='hv-center text-gray'>
          {search && search.length >= 3 ? 'No Result' : <div className='text-center'>Search...<p>Min three char required</p></div>}
        </div>)
        : (
          <Collapse accordion className='search-title' defaultActiveKey={[activekey]}>

            {!isEmpty(customer) ? (
              <Panel header='Customer' key='1'>
                {customer.map((result, i) => <Result key={i} {...result} type='customers' />)}
              </Panel>) : null}

            {!isEmpty(partner) ? (
              <Panel header='Partner' key='2'>
                {partner.map((result, i) => <Result key={i} {...result} type='partners' />)}
              </Panel>) : null}

            {!isEmpty(trip) ? (
              <Panel header='Trip' key='3'>
                {trip.map((result, i) => <Result key={i} {...result} type='trips' />)}
              </Panel>) : null}

            {!isEmpty(truck) ? (
              <Panel header='Truck' key='4'>
                {truck.map((result, i) => <Result key={i} {...result} type='trucks' />)}
              </Panel>) : null}

            {!isEmpty(lead) ? (
              <Panel header='Partner Lead' key='5'>
                {lead.map((result, i) => <Result key={i} {...result} type='partners/create-partner' />)}
              </Panel>) : null}

          </Collapse>
        )}
    </Drawer>
  )
}

const Result = (props) => {
  const { link, description, type } = props
  return (
    <div className='search-result'>
      <LabelAndData
        label={link}
        data={
          <Link href={`/${type}/[id]`} as={`/${type}/${link}`}>
            <a target='_blank'>{description.length > 24 ? description.slice(0, 24) + '...' : description}</a>
          </Link>
        }
        smSpan={24}
        mdSpan={24}
      />
    </div>
  )
}

export default GlobalSearch
