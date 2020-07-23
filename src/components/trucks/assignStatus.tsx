import { Row, Button, Tag ,Col,Divider} from 'antd'
import { SnippetsOutlined } from '@ant-design/icons'
import useShowHide from '../../hooks/useShowHide'
import CustomerPo from '../../components/trips/createPo'

const AssignStatus = () => {
    const initial = { poModal: false}
    const { visible, onShow, onHide } = useShowHide(initial)
    return (
        <div>

      <Row gutter={[10, 10]}>
          <Col xs={24} >
              <Button type='primary' size='small' onClick={() => onShow('poModal')}><SnippetsOutlined/> </Button>
              <Divider type="vertical" />
              <Tag >Waiting for load</Tag>
          </Col>
          {visible.poModal && <CustomerPo visible={visible.poModal} onHide={() => onHide()} />}
          </Row>

          </div>
    )
}

export default AssignStatus
