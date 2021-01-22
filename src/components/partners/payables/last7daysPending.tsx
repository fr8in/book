import { Table, Tooltip, Pagination, Input, Checkbox } from 'antd'
import { useState } from 'react'
import { gql, useSubscription, useQuery } from '@apollo/client'
import get from 'lodash/get'
import Truncate from '../../common/truncate'
import u from '../../../lib/util'
import moment from 'moment'
import LinkComp from '../../common/link'
import { SearchOutlined } from '@ant-design/icons'
import isEmpty from 'lodash/isEmpty'

const ICICIBANK_STATEMENT = gql`
subscription iciciBank_Statement($offset:Int, $limit:Int,$where:iciciBank_statement_bool_exp) {
  iciciBank_statement (
    offset:$offset,
    limit:$limit,
    order_by:{txn_date:desc}
    where:$where
  ){
     id 
     txn_date
     amount
     outgoing_no
     bank_reference_no
     type
     cardcode
     remarks
     balance
     date
     partner{
       name
     }
   }
 }
 `
const ICICIBANK_STATEMENT_AGGREGATE = gql`
query iciciBank_statement_aggregate($where:iciciBank_statement_bool_exp){
  iciciBank_statement_aggregate(where:$where){
    aggregate{
      count
    }
  }
}
`
const TypeFilter = [
  { value: 1, text: 'CR' },
  { value: 2, text: 'DR' }
]

const Last7daysPending = () => {

  const initial = { 
    offset: 0, 
    cardcode:null, 
    partner: null, 
    amount: null, 
    outgoingNo: null, 
    refNo:null , 
    remarks: null,
    type: null
  }
  const [filter, setFilter] = useState(initial)
  const [currentPage, setCurrentPage] = useState(1)

  const perviousDate = u.getPervious4thDate()
  const futureDate = u.getfuture3rdDate()

const where = {
      _and:[
        {txn_date:{_gt:moment(perviousDate).format('DD-MMM-YY')}},
        {txn_date:{_lte: moment(futureDate).format('DD-MMM-YY')}}
      ],
      cardcode:{_ilike:filter.cardcode ? `%${filter.cardcode}%` : null},
      ...!isEmpty(filter.partner) ? {partner:{name:{_ilike: filter.partner ? `%${filter.partner}%` : null}}} : null,
      amount:{_ilike:filter.amount ? `%${filter.amount}%` : null},
      remarks:{_ilike: filter.remarks ? `%${filter.remarks}%` : null},
      bank_reference_no:{_ilike:filter.refNo ? `%${filter.refNo}%` : null},
      outgoing_no:{_ilike:filter.outgoingNo ? `%${filter.outgoingNo}%` : null},
      ...!isEmpty(filter.type) && { type: { _in: filter.type } } ,
}

  const { loading, error, data } = useSubscription(
    ICICIBANK_STATEMENT,
    {
      variables: {
        offset: filter.offset,
        limit: u.limit,
        where: where
      }
    }
  )
  console.log('last7daysPending Error', error)

  let _statement = []
  if (!loading) {
    _statement = data
  }
  const statement = get(_statement, 'iciciBank_statement', [])

  const { loading: count_loading, error: count_error, data: count_data } = useQuery(
    ICICIBANK_STATEMENT_AGGREGATE,
    {
      variables: {
        where: where
      },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )
  let _statement_count = []
  if (!count_loading) {
    _statement_count = count_data
  }
  const statement_count = get(_statement_count, 'iciciBank_statement_aggregate', [])
  const record_count = get(statement_count, 'aggregate.count', null)

  const typeFilterList = TypeFilter.map((data) => {
    return { value: data.text, label: data.text }
  })

  const onPageChange = (page, pageSize) => {
    const newOffset = page * pageSize - u.limit
    setCurrentPage(page)
    setFilter({...filter, offset:newOffset})
  }
  const onCardcodeSearch = (e) => {
    setFilter({...filter, cardcode:e.target.value, offset: 0 })
  }
  const onPartnerSearch = (e) => {
    setFilter({...filter, partner:e.target.value, offset: 0 })
  }
  const onAmountSearch = (e) => {
    setFilter({...filter, amount:e.target.value, offset: 0 })
  }
  const onOutgoingSearch = (e) => {
    setFilter({...filter, outgoingNo:e.target.value, offset: 0 })
  }
  const onRefNoSearch = (e) => {
    setFilter({...filter, refNo:e.target.value, offset: 0 })
  }
  const onRemarksSearch = (e) => {
    setFilter({...filter, remarks:e.target.value, offset: 0 })
  }
  const onTypeFilter = (checked) => {
    setFilter({ ...filter, type: checked, offset: 0 })
    setCurrentPage(1)
  }
  const columns = [
    {
      title: 'Partner',
      dataIndex: 'partner',
      render: (text, record) => {
        const partner = get(record, 'partner.name', null)
        return( <Truncate data={partner} length={11} />)
      },
      filterDropdown: (
        <div>
          <Input
            placeholder='Search Partner'
            value={filter.partner}
            onChange={onPartnerSearch}
          />
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      width: '9%',
    },
    {
      title: 'Cardcode',
      dataIndex: 'cardcode',
      width: '8%',
      render: (text, record) => {
        return (
          <LinkComp type='partners' data={text} id={text} />
        )
      },
      filterDropdown: (
        <div>
          <Input
            placeholder='Search Cardcode'
            value={filter.cardcode}
            onChange={onCardcodeSearch}
          />
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      )
    },
    {
      title: <Tooltip title='Transaction Date'>Tnx Date</Tooltip>,
      dataIndex: 'txn_date',
      render: (text, render) => text ? moment(text).format('DD-MMM-YY HH:mm:ss') : '-',
      sorter: (a, b) => (a.txn_date > b.txn_date ? 1 : -1),
      width: '13%',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      filterDropdown: (
        <div>
          <Input
            placeholder='Search Amount'
            value={filter.amount}
            onChange={onAmountSearch}
          />
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      width: '5%',
    },
    {
      title: 'Outgoing No',
      dataIndex: 'outgoing_no',
      filterDropdown: (
        <div>
          <Input
            placeholder='Search OutGoingNo'
            value={filter.outgoingNo}
            onChange={onOutgoingSearch}
          />
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      width: '9%',
    },
    {
      title: <Tooltip title='Bank Reference No'>Ref No</Tooltip>,
      dataIndex: 'bank_reference_no',
      filterDropdown: (
        <div>
          <Input
            placeholder='Search refNo'
            value={filter.refNo}
            onChange={onRefNoSearch}
          />
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      width: '8%',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      filters: TypeFilter,
      filterDropdown: (
        <Checkbox.Group
          options={typeFilterList}
          defaultValue={filter.type}
          onChange={onTypeFilter}
          className='filter-drop-down'
        />
      ),
      width: '4%',
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      render: (text, record) => {
        const remarks = get(record, 'remarks', null)
        return (<Truncate data={remarks} length={90} />)
      },
      filterDropdown: (
        <div>
          <Input
            placeholder='Search Remarks'
            value={filter.remarks}
            onChange={onRemarksSearch}
          />
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      width: '38%',
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      width: '6%',
    }
  ]

  return (
    <>
      <Table
        rowKey={record => record.id}
        columns={columns}
        dataSource={statement}
        size='small'
        scroll={{ x: 1250 }}
        pagination={false}
        loading={loading}
      />
      {!loading && record_count &&
        <Pagination
          size='small'
          current={currentPage}
          pageSize={u.limit}
          showSizeChanger={false}
          total={record_count}
          onChange={onPageChange}
          className='text-right p10'
        />}
    </>
  )
}

export default Last7daysPending

