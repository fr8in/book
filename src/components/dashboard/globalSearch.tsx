import { Drawer, Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

const GlobalSearch = (props) => {
  const { visible, onHide } = props
  return (
    <Drawer
      title={<Input placeholder='Search...' prefix={<SearchOutlined />} />}
      placement='right'
      closable={false}
      onClose={onHide}
      visible={visible}
    >
      <p>Search contents...</p>
    </Drawer>
  )
}

export default GlobalSearch
