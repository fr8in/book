import { Table, Checkbox,message } from 'antd'
import moment from 'moment'
import { gql, useSubscription,useMutation } from '@apollo/client'
import get from 'lodash/get'

const ANNOUNCEMENT_QUERY = gql`
subscription announcement{
  announcement{
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
      description
    }
  }
}
`
const Announcement = () => {

  const { loading, error, data } = useSubscription(ANNOUNCEMENT_QUERY)
  console.log('error', error)

  let _data = []
  if (!loading){
       _data = data 
  }
  const Announcement = get(_data,'announcement',[])
  console.log('announcement',Announcement)
  
  const [updateAnnouncement] = useMutation(
    UPDATE_ANNOUNCEMENT_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () {
        message.success('Updated!!')
      }
    }
  )

  const onChange = (e) => {
    updateAnnouncement({
      variables: {
        id: data.id,
        deleted: e.target.checked
      }
    })
  }
  const columnsCurrent = [
    {
      title: 'Date',
      width: ' 10%',
      render: (text, record) => {
        return record.createdat ? moment(record.createdat).format('DD-MMM-YY hh:mm') : null
      }
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
      width: '50%'
    },
    {
      title: 'Published',
      dataIndex: 'deleted',
      render: (text, record) => (
        <Checkbox onChange={onChange} />
      ),
      width: ' 10%'
    }
  ]
  return (
    <Table
      columns={columnsCurrent}
      dataSource={Announcement}
      rowKey={record => record.id}
      size='middle'
      scroll={{ x: 1156 }}
      pagination={false}
    />
  )
}

export default Announcement
