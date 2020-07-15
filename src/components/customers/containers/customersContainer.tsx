import { Tabs, Row, Col, Card, Input } from 'antd'
import Customers from '../customers'
import CustomerKyc from '../customerKyc'

const { Search } = Input
const TabPane = Tabs.TabPane
const CustomersContainer = () => {
    return (
        <Row gutter={[10, 10]}>
        <Col sm={24}>
          <Card size='small' className='card-body-0 border-top-blue'>
            <Tabs>
              <TabPane tab='Customers' key='1'>
                <Row justify='end' className='m5'>
                  <Col flex='180px'>
                    <Search
                      placeholder='Search...'
                      onSearch={(value) => console.log(value)}
                    />
                  </Col>
                </Row>
                <Customers />
              </TabPane>
              <TabPane tab='Approval Pending' key='2'>
                <Row justify='end' className='m5'>
                  <Col flex='180px'>
                    <Search
                      placeholder='PAN or Name or Mobile...'
                      onSearch={(value) => console.log(value)}
                    />
                  </Col>
                </Row>
                <CustomerKyc />
              </TabPane>
              <TabPane tab='Rejected' key='3'>
                <Row justify='end' className='m5'>
                  <Col flex='180px'>
                    <Search
                      placeholder='PAN or Name or Mobile...'
                      onSearch={(value) => console.log(value)}
                    />
                  </Col>
                </Row>
                <CustomerKyc />
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    )
}

export default CustomersContainer
