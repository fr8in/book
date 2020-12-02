import { Table, Input } from 'antd'
import { useState } from 'react'
import {gql, useQuery } from '@apollo/client'
import { SearchOutlined } from '@ant-design/icons'
import get from 'lodash/get'
import moment from 'moment'
import Truncate from '../common/truncate'
import LinkComp from '../common/link'

const ADVANCE_PENDING_QUERY = gql`
query trips($cardcode: String) {
    trip(where: {customer: {cardcode: {_eq: $cardcode}}, trip_accounting: {receipt: {_neq: 0}}}) {
      id
      truck {
        truck_no
      }
      partner{
        name
      }
      source{
        name
      }
      destination{
        name
      }
      trip_receipts_aggregate {
        aggregate {
          sum {
            amount
          }
        }
      }
      trip_receivables_aggregate {
        aggregate {
          sum {
            amount
          }
        }
      }
    }
  }  
`
const AdvancePending = (props) =>{
    const {cardcode} = props

    const { loading, error, data } = useQuery(
        ADVANCE_PENDING_QUERY,
        {
          variables:{
              cardcode:cardcode
          } 
        }
      )
console.log('Advance pending error', error)
      let trips = []
      if (!loading) {
        trips = data
      }
      
console.log('trips',trips)
    const finalPaymentsPending = [
        {
          title: 'ID',
          dataIndex: 'id',
          sorter: (a, b) => (a.id > b.id ? 1 : -1),
          width: '6%',
          render: (text, record) => (
            <LinkComp
              type='trips'
              data={text}
              id={record.id}
            />
          )
        },
        {
          title: 'O.Date',
          dataIndex: 'created_at',
          width: '8%',
          render: (text, record) => text ? moment(text).format('DD-MMM-YY') : '-'
        },
        {
          title: 'Truck No',
          width: '16%',
          render: (text, record) => {
            const truck_no = get(record, 'truck.truck_no', null)
            const truck_type_name = get(record, 'truck.truck_type.name', null)
            const truck_type = truck_type_name ? truck_type_name.slice(0, 9) : null
            return (
              <LinkComp
                type='trucks'
                data={`${truck_no} - ${truck_type}`}
                id={truck_no}
              />
            )
          },
          filterDropdown: (
            <Input
              placeholder='Search'
            //   value={filter.truckno}
            //   onChange={onTruckNoSearch}
            />
          ),
          filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
          )
        },
        {
          title: 'Partner',
          width: '10%',
          render: (text, record) => {
            const partner = get(record, 'partner.name', null)
            const cardcode = get(record, 'partner.cardcode', null)
            return (
              <LinkComp
                type='partners'
                data={partner}
                id={cardcode}
                length={10}
              />
            )
          },
          filterDropdown: (
            <Input
              placeholder='Search'
            //   value={filter.partnername}
            //   onChange={onPartnerNameSearch}
            />
          ),
          filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
          )
        },
        {
          title: 'Source',
          width: '10%',
          render: (text, record) => get(record, 'source.name', '-'),
          filterDropdown: (
            <Input
              placeholder='Search'
            //   value={filter.sourcename}
            //   onChange={onSourceNameSearch}
            />
          ),
          filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
          )
        },
        {
          title: 'Destination',
          width: '10%',
          render: (text, record) => get(record, 'destination.name', '-'),
          filterDropdown: (
            <Input
              placeholder='Search'
            //   value={filter.destinationname}
            //   onChange={onDestinationNameSearch}
            />
          ),
          filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
          )
        },
        // !delivered
        //   ? {
        //       title: 'Status',
        //       width: '11%',
        //       render: (text, record) => <Truncate data={get(record, 'trip_status.name', '-')} length={15} />
        //     }
        //   : {},
        // delivered
        //   ? {
        //       title: 'Pod Verified at',
        //       width: '11%',
        //       dataIndex: 'pod_verified_at',
        //       render: (text, record) => text ? moment(text).format('DD-MMM-YY') : '-'
        //     }
        //   : {},
        {
          title: 'Receivable',
          width: '8%',
          sorter: (a, b) => (a.receivable > b.receivable ? 1 : -1),
          render: (record) => get(record, 'trip_receivables_aggregate.aggregate.sum.amount', 0)
        },
        {
          title: 'Receipts',
          width: '7%',
          sorter: (a, b) => (a.receipts > b.receipts ? 1 : -1),
          render: (record) => get(record, 'trip_receipts_aggregate.aggregate.sum.amount', 0)
        },
        {
          title: 'Balance',
          sorter: (a, b) => (a.balance > b.balance ? 1 : -1),
          width: '7%',
          render: (record) => {
            const receivable = get(record, 'trip_receivables_aggregate.aggregate.sum.amount', 0)
            const receipts = get(record, 'trip_receipts_aggregate.aggregate.sum.amount', 0)
            return (receivable - receipts)
          }
        },
        {
          title: 'Aging',
         // render: (text, record) => tat(record),
        //   sorter: (a, b) => {
        //     const status = get(a, 'trip_status.name', null)
         //   return status ? (tat(a) > tat(b) ? 1 : -1) : null
          //},
          width: '7%'
        }
      ]
    return(
        <Table
        columns={finalPaymentsPending}
        dataSource={trips}
        rowKey={(record) => record.id}
        size='small'
        scroll={{ x: 800, y: 400 }}
        pagination={false}
        //loading={loading}
      />
    )
}
export default AdvancePending