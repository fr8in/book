import Branch from '../branches';
import Employees from '../employees';
import City from '../cityPricing';
import AddBranch from '../addBranch';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Tabs, Row, Col, Card, Button } from 'antd';
import { gql, useQuery } from '@apollo/client';

import useShowHide from '../../../hooks/useShowHide';

const TabPane = Tabs.TabPane

const EMPLOYEE_QUERY = gql`
  query BranchEmployee {
    employee {
      id
      name
    }
  }
`

const BranchesContainer = () => {
  const { loading, error, data } = useQuery(EMPLOYEE_QUERY, {
    notifyOnNetworkStatusChange: true
  })

  console.log('BranchesContainer error', error)
  var employee = []

  if (!loading) {
    employee = data.employee
  }

  const initial = { showModal: false }
  const { visible, onShow, onHide } = useShowHide(initial)
  return (
    <Card size='small' className='card-body-0 border-top-blue'>
      <Tabs>
        <TabPane tab='Container' key='1'>
          <Row justify='end' className='m5'>
            <Col flex='130px'>
              <Button
                title='Add Branch'
                size='small'
                type='primary'
                icon={<PlusCircleOutlined />}
                onClick={() => onShow('showModal')}
              >
                Add Branch
              </Button>
            </Col>
          </Row>
          <Branch />
        </TabPane>
        <TabPane tab='Employess' key='2'>
          <Employees employees={employee} loading={loading} />
        </TabPane>
        <TabPane tab='City Pricing' key='3'>
          <City />
        </TabPane>
      </Tabs>
      {visible.showModal && (
        <AddBranch visible={visible.showModal} onHide={onHide} />
      )}
    </Card>
  )
};

export default BranchesContainer
