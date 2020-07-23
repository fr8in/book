import { Col, Button, Menu, Dropdown, Drawer, Space } from 'antd'
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
import GlobalFilter from '../dashboard/globalFilter'
import GlobalSearch from '../dashboard/globalSearch'
import Ssh from '../dashboard/ssh'

const Actions = () => {
  const initial = { filter: false, search: false, ssh: false }
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
      <Menu.Item key='0'>ICICI <b>₹{'7,70,027'}</b></Menu.Item>
      <Menu.Item key='1'>YesBank <b>₹{'48266'}</b></Menu.Item>
      <Menu.Item key='2'>Reliance <b>₹{'1,87,694'}</b></Menu.Item>
    </Menu>
  )

  return (
    <Col flex='auto' className='actions'>
      <Space>
        <Button size='small' type='ghost' shape='circle' icon={<FilterFilled />} onClick={() => onShow('filter')} />
        <Button size='small' type='ghost' shape='circle' icon={<SearchOutlined />} onClick={() => onShow('search')} />
        <Dropdown overlay={account} trigger={['click']} placement='bottomRight'>
          <Button size='small' type='ghost' shape='circle' icon={<BankFilled />} />
        </Dropdown>
        <Button size='small' type='ghost' shape='circle' icon={<CodeOutlined />} onClick={() => onShow('ssh')} />
        <Dropdown overlay={user} trigger={['click']} placement='bottomRight'>
          <Button size='small' type='primary' shape='circle' icon={<UserOutlined />} />
        </Dropdown>
      </Space>

      {visible.filter &&
        <Drawer
          placement='right'
          closable={false}
          onClose={() => onHide('filter')}
          visible={visible.filter}
        >
          <GlobalFilter />
        </Drawer>}

      {visible.search &&
        <GlobalSearch visible={visible.search} onHide={() => onHide('search')} />}

      {visible.ssh &&
        <Ssh visible={visible.ssh} onHide={() => onHide('ssh')} />}
    </Col>
  )
}

export default Actions
