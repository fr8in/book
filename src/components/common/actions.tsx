import { Col, Button, Menu, Dropdown, Drawer } from 'antd'
import {
  UserOutlined,
  SearchOutlined,
  CodeOutlined,
  FilterFilled,
  BankFilled,
  LogoutOutlined
} from '@ant-design/icons'
import Link from 'next/link'
import useShowHide from '../../hooks/useShowHide'

const Actions = () => {
  const initial = { filter: false, search: false }
  const { visible, onShow, onHide } = useShowHide(initial)
  const user = (
    <Menu>
      <Menu.Item key='0'>
        <Link href='/login'><a><LogoutOutlined /> Logout</a></Link>
      </Menu.Item>
    </Menu>
  )

  const account = (
    <Menu>
      <Menu.Item key='0'>ICICI <span>₹{'7,70,027'}</span></Menu.Item>
      <Menu.Item key='1'>YesBank <span>₹{'48266'}</span></Menu.Item>
      <Menu.Item key='2'>Reliance <span>₹{'1,87,694'}</span></Menu.Item>
    </Menu>
  )

  return (
    <Col xs={20} className='actions'>
      <Button size='small' type='ghost' shape='circle' icon={<FilterFilled />} onClick={() => onShow('filter')} />
      <Button size='small' type='ghost' shape='circle' icon={<SearchOutlined />} onClick={() => onShow('search')} />
      <Dropdown overlay={account} trigger={['click']} placement='bottomRight'>
        <Button size='small' type='ghost' shape='circle' icon={<BankFilled />} />
      </Dropdown>
      <Button size='small' type='ghost' shape='circle' icon={<CodeOutlined />} />
      <Dropdown overlay={user} trigger={['click']} placement='bottomRight'>
        <Button size='small' type='primary' shape='circle' icon={<UserOutlined />} />
      </Dropdown>

      <Drawer
        title='Basic Drawer'
        placement='right'
        closable={false}
        onClose={() => onHide('filter')}
        visible={visible.filter}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>
      <Drawer
        title='Search Drawer'
        placement='right'
        closable={false}
        onClose={() => onHide('search')}
        visible={visible.search}
      >
        <p>Search contents...</p>
        <p>Search contents...</p>
        <p>Search contents...</p>
      </Drawer>
    </Col>
  )
}

export default Actions
