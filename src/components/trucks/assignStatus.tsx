import { Row, Col , Button, Divider, Tag} from 'antd'
import { SnippetsOutlined } from '@ant-design/icons'

export default function assignStatus() {
    return (
        <div>

      <Row gutter={[10, 10]}>
          <Col xs={24} >
              <Button type='primary' size='small'><SnippetsOutlined/></Button>
              <Divider type="vertical" />
              <Tag >Waiting for load</Tag>
          </Col>

          </Row>

          </div>
    )
}