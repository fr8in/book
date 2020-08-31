import Branch from '../branches'
import Employees from '../employees'
import CityBranchMapping from '../cityBranchMapping'
import AddBranch from '../addBranch'
import { PlusCircleOutlined } from '@ant-design/icons'
import { Tabs, Card, Button } from 'antd'
import useShowHide from '../../../hooks/useShowHide'
import { gql, useSubscription } from '@apollo/client'
import get from 'lodash/get'

const CITY_QUERY = gql`
subscription{
  city{
    id
    name
    branch{
      id
      name
    }
  }
}
`
const TabPane = Tabs.TabPane

const BranchesContainer = () => {
  const initial = { showModal: false }
  const { visible, onShow, onHide } = useShowHide(initial)
  const { loading, error, data } = useSubscription(
    CITY_QUERY, 
    {

  })
  console.log('error', error)
  
let _data = []
if (!loading){
     _data = data 
}
const citymapping = get(_data,'city',[])
console.log('city',citymapping)

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
          <CityBranchMapping citymapping={citymapping} />
        </TabPane>
      </Tabs>
      {visible.showModal && (
        <AddBranch visible={visible.showModal} onHide={onHide} />
      )}
    </Card>
  )
}

export default BranchesContainer
