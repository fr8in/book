import { Button } from 'antd'
import { SnippetsOutlined } from '@ant-design/icons'
import useShowHide from '../../hooks/useShowHide'
import CustomerPo from '../../components/trips/createPo'

const AssignTrip = () => {
  const initial = { poModal: false }
  const { visible, onShow, onHide } = useShowHide(initial)
  return (
    <div>
      <Button type='primary' shape='circle' onClick={() => onShow('poModal')} icon={<SnippetsOutlined />} />
      {visible.poModal && <CustomerPo visible={visible.poModal} onHide={() => onHide()} />}
    </div>
  )
}

export default AssignTrip
