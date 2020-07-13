import React, { Component } from 'react'
import { Table } from 'antd'
import rejectedMock from '../../../mock/customer/rejectedListMock'

export default class RejectedList extends Component {
  render () {
    const rejectedList = [
      {
        title: 'User Name',
        dataIndex: 'userName'
      },
      {
        title: 'Company Name',
        dataIndex: 'companyName'
      },
      {
        title: 'Mobile No',
        dataIndex: 'mobileNo'
      },
      {
        title: 'Customer Type',
        dataIndex: 'companyType'
      },
      {
        title: 'Registration Date',
        dataIndex: 'registrationDate'
      },
      {
        title: 'PAN',
        dataIndex: 'panNo'
      },
      {
        title: 'Credit Limit',
        dataIndex: 'CreditLimit'
      },
      {
        title: 'Advance %',
        dataIndex: 'advancePercentage'
      },
      {
        title: 'Action',
        dataIndex: 'type'
      }
    ]
    return <Table columns={rejectedList} dataSource={rejectedMock} />
  }
}
