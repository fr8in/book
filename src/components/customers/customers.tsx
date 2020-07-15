import { Table } from 'antd'
import Link from 'next/link'
import PageLayout from '../layout/pageLayout'
import { useQuery } from '@apollo/react-hooks'
import { NetworkStatus } from 'apollo-client'
import gql from 'graphql-tag'

export const ALL_CUSTOMER_QUERY = gql`
  query customers($offset: Int!, $limit: Int!) {
    customer(offset: $offset, limit: $limit) {
      id
      name
      mobileNo
      cardCode
    }
  }
`
export const customersQueryVars = {
  offset: 0,
  limit: 10
}

const Customers = () => {
  const { loading, error, data, fetchMore, networkStatus } = useQuery(
    ALL_CUSTOMER_QUERY,
    {
      variables: customersQueryVars,
      // Setting this value to true will make the component rerender when
      // the "networkStatus" changes, so we are able to know if it is fetching
      // more data
      notifyOnNetworkStatusChange: true
    }
  )

  const loadingMoreCustomers = networkStatus === NetworkStatus.fetchMore

  const loadMoreCustomers = () => {
    fetchMore({
      variables: {
        offset: customer.length
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return previousResult
        }
        return Object.assign({}, previousResult, {
          // Append the new posts results to the old one
          customer: [...previousResult.customer, ...fetchMoreResult.customer]
        })
      }
    })
  }

  if (loading && !loadingMoreCustomers) return <div>Loading</div>
  console.log(data)
  const { customer } = data

  const columnsCurrent = [
    {
      title: 'Customer',
      dataIndex: 'name',
      render: (text, record) => {
        return (
          <Link
            href='customers/[id]'
            as={`customers/${record.cardCode}`}
          >
            <a>{text}</a>
          </Link>
        )
      }
    },
    {
      title: 'User Phone',
      dataIndex: 'mobileNo'
    },
    {
      title: 'Orders',
      dataIndex: 'noOfLoadsTaken',
      sorter: true
    },
    {
      title: 'systemMamul',
      dataIndex: 'systemMamul'
    },
    {
      title: 'Credit Limit',
      dataIndex: 'creditLimit'
    },
    {
      title: 'Receivables',
      dataIndex: 'receivables'
    },
    {
      title: 'Receivable Days',
      dataIndex: 'workingCapitalDays'
    },
    {
      title: 'Status',
      dataIndex: 'Status'
    }
  ]

  return (
    <PageLayout title='Customer'>
      <Table
        columns={columnsCurrent}
        dataSource={customer}
        rowKey={record => record.id}
        size='small'
        scroll={{ x: 800, y: 400 }}
        pagination={false}
      />
    </PageLayout>
  )
}

export default Customers
