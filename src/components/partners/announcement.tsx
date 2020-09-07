import { Table, Checkbox, message } from 'antd'
import moment from 'moment'
import { gql, useSubscription, useMutation } from '@apollo/client'
import get from 'lodash/get'
import Truncate from '../common/truncate'

const ANNOUNCEMENT_QUERY = gql`
subscription announcement{
  announcement(order_by: {createdat:desc}){
    id
    createdat
    createdby
    title
    description
    deleted
  }
}
`
const UPDATE_ANNOUNCEMENT_MUTATION = gql`
mutation update_announcement($id: Int, $deleted: Boolean) {
  update_announcement(where: {id: {_eq: $id}}, _set: {deleted: $deleted}) {
    returning {
      id
      deleted
    }
  }
}
`
const Announcement = () => {
  const { loading, error, data } = useSubscription(ANNOUNCEMENT_QUERY)
  console.log('Announcement error', error)

  let _data = []
  if (!loading) {
    _data = data
  }
  const announcement = get(_data, 'announcement', [])

  const [updateAnnouncement] = useMutation(
    UPDATE_ANNOUNCEMENT_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () {
        message.success('Updated!!')
      }
    }
  )

  const onChange = (e, id) => {
    updateAnnouncement({
      variables: {
        id: id,
        deleted: !e.target.checked
      }
    })
  }
  const columnsCurrent = [
    {
      title: 'Date',
      dataIndex: 'createdat',
      width: ' 10%',
      render: (text, record) => text ? moment(text).format('DD-MMM-YY') : null
    },
    {
      title: 'Created By',
      dataIndex: 'createdby',
      width: ' 15%'
    },
    {
      title: 'Title',
      dataIndex: 'title',
      width: ' 15%'
    },
    {
      title: 'Description',
      dataIndex: 'description',
      width: '50%',
      render: (text, record) => <Truncate data={text} length={240} />
    },
    {
      title: 'Published',
      dataIndex: 'deleted',
      render: (text, record) => <Checkbox checked={!text} onChange={(e) => onChange(e, record.id)} />,
      width: ' 10%'
    }
  ]
  return (
    <Table
      columns={columnsCurrent}
      dataSource={announcement}
      rowKey={record => record.id}
      size='small'
      scroll={{ x: 1156 }}
      pagination={false}
      loading={loading}
    />
  )
}

export default Announcement
