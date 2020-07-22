import { Space, Button, Tag } from 'antd'
import { SnippetsOutlined } from '@ant-design/icons'

const AssignStatus = () => {
  return (
    <Space>
      <Button type='primary' size='small'><SnippetsOutlined /></Button>
      <Tag>Waiting for load</Tag>
    </Space>
  )
}

export default AssignStatus
