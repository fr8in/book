import { useContext, useState } from 'react'
import Branch from '../branches'
import Employees from '../employees'
import CityBranchMapping from '../cityBranchMapping'
import AddBranch from '../addBranch'
import { PlusCircleOutlined } from '@ant-design/icons'
import { Tabs, Card, Button } from 'antd'
import u from '../../../lib/util'
import useShowHide from '../../../hooks/useShowHide'
import userContext from '../../../lib/userContaxt'
import isEmpty from 'lodash/isEmpty'

const TabPane = Tabs.TabPane

const BranchesContainer = () => {
  const { role } = u
  const add_branch_access = [role.admin,role.hr]
  const traffic_member_edit = [role.admin,role.hr,role.user]
  const initial = { showModal: false }
  const { visible, onShow, onHide } = useShowHide(initial)
  const [totalBranch, setTotalBranch] = useState(0)

  const context = useContext(userContext)
  const access =  u.is_roles(add_branch_access,context)

  return (
    <Card
      size='small'
      className='card-body-0 border-top-blue'
    >
      <Tabs
        tabBarExtraContent={access ? (
          <Button
            title='Add Branch'
            type='primary'
            icon={<PlusCircleOutlined />}
            onClick={() => onShow('showModal')}
          >
                Add Branch
          </Button>) : null}
      >
        <TabPane tab='Branches' key='1'>
          <Branch edit_access={traffic_member_edit} setTotalBranch={setTotalBranch} />
        </TabPane>
        <TabPane tab='Employess' key='2'>
          <Employees />
        </TabPane>
        <TabPane tab='City Branch Mapping' key='3'>
          <CityBranchMapping />
        </TabPane>
      </Tabs>
      {visible.showModal && <AddBranch visible={visible.showModal} totalBranch={totalBranch} onHide={onHide} />}
    </Card>
  )
}

export default BranchesContainer
