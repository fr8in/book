import Branch from '../branches'
import Employees from '../employees'
import CityBranchMapping from '../cityBranchMapping'
import AddBranch from '../addBranch'
import { PlusCircleOutlined } from '@ant-design/icons'
import { Tabs, Card, Button } from 'antd'
import useShowHide from '../../../hooks/useShowHide'

const TabPane = Tabs.TabPane

const BranchesContainer = () => {
  const initial = { showModal: false }
  const { visible, onShow, onHide } = useShowHide(initial)
  

  return (
    <Card
      size='small'
      className='card-body-0 border-top-blue'
    >
      <Tabs
        tabBarExtraContent={
          <Button
            title='Add Branch'
            type='primary'
            icon={<PlusCircleOutlined />}
            onClick={() => onShow('showModal')}
          >
                Add Branch
          </Button>
        }
      >
        <TabPane tab='Branches' key='1'>
          <Branch />
        </TabPane>
        <TabPane tab='Employess' key='2'>
          <Employees />
        </TabPane>
        <TabPane tab='City Branch Mapping' key='3'>
          <CityBranchMapping />
        </TabPane>
      </Tabs>
      {visible.showModal && (
        <AddBranch visible={visible.showModal} onHide={onHide} />
      )}
    </Card>
  )
}

export default BranchesContainer
