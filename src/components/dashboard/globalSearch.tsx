import { useState } from 'react'
import { Drawer, Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { gql, useQuery } from '@apollo/client'
import Loading from '../common/loading'
import LabelAndData from '../common/labelAndData'
import Link from 'next/link'
import get from 'lodash/get'

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
}
`
const GlobalSearch = (props) => {
  const { visible, onHide } = props
  const [search, setSearch] = useState(null)

  const { loading, error, data } = useQuery(
    GLOBAL_SEARCH,
    {
      variables: { search: search }
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

  console.log('GlobalSearch Error', error)

  const onSearch = (e) => {
    setSearch(e.target.value)
  }
  const no_data = (customer && customer.length === 0) && (partner && partner.length === 0) && (trip && trip.length === 0) && (truck && truck.length === 0)
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
        </div>) : ''}
      {customer && customer.length > 0 &&
        <span>
          <h4 className='search-title'>Customer</h4>
          {customer.map((result, i) => {
            return (
              <Result key={i} {...result} type='customers' />
            )
          })}
        </span>}
      {partner && partner.length > 0 &&
        <span>
          <h4 className='search-title'>Partner</h4>
          {partner.map((result, i) => {
            return (
              <Result key={i} {...result} type='partners' />
            )
          })}
        </span>}
      {trip && trip.length > 0 &&
        <span>
          <h4 className='search-title'>Trip</h4>
          {trip.map((result, i) => {
            return (
              <Result key={i} {...result} type='trips' />
            )
          })}
        </span>}
      {truck && truck.length > 0 &&
        <span>
          <h4 className='search-title'>Truck</h4>
          {truck.map((result, i) => {
            return (
              <Result key={i} {...result} type='trucks' />
            )
          })}
        </span>}
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
