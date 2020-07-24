import { Collapse, Input, Row, Col, Tabs, Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import LabelWithData from '../common/labelWithData'
import FasTag from '../../components/partners/cards/fasTag'
import PartnerFuelDetail from '../../components/partners/cards/partnerFuelDetail'
const { Panel } = Collapse

const { TabPane } = Tabs
const PartnerDocument = () => {
  return (
    <Collapse accordion>
      <Panel header='Document' key='1'>
        <Tabs type='card'>
          <TabPane tab='Main' key='1'>
            <Row gutter={8}>
              <Col xs={24} sm={24} md={24}>
                <LabelWithData
                  label='PAN'
                  data={<Button icon={<UploadOutlined />} />}
                  labelSpan={10}
                  dataSpan={14}
                />
                <LabelWithData
                  label='Card Number'
                  data={<Button icon={<UploadOutlined />} />}
                  labelSpan={10}
                  dataSpan={14}
                />
                <LabelWithData
                  label='Balance'
                  data={<Button icon={<UploadOutlined />} />}
                  labelSpan={10}
                  dataSpan={14}
                />
                <LabelWithData
                  label=' Linked Mobile '
                  data={<Button icon={<UploadOutlined />} />}
                  labelSpan={10}
                  dataSpan={14}
                />

                <LabelWithData
                  label='Status'
                  data={<Button icon={<UploadOutlined />} />}
                  labelSpan={10}
                  dataSpan={14}
                />
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Panel>
      <Panel header='Fuel Detail' key='2'>
        <PartnerFuelDetail />
      </Panel>
      <Panel header='FasTag' key='3'>
        <FasTag />
      </Panel>
    </Collapse>
  )
}

export default PartnerDocument
