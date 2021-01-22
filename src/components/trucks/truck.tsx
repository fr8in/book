
import LabelAndData from '../common/labelAndData'
import Link from 'next/link'
import { Row } from 'antd'
import Driver from '../trucks/driver'
import Phone from '../common/phone'
import useShowHidewithRecord from '../../hooks/useShowHideWithRecord'
import { EditTwoTone } from '@ant-design/icons'
import CreateBreakdown from '../../components/trucks/createBreakdown'

const Truck = (props) => {
  const { truck_info } = props
  const driver_number = truck_info && truck_info.driver && truck_info.driver.mobile
  const initial = {
    editVisible: false,
    editData: [],
    title: ''
  }
  const { object, handleHide, handleShow } = useShowHidewithRecord(initial)
  const number = truck_info.partner && truck_info.partner.partner_users && truck_info.partner.partner_users.length > 0 &&
    truck_info.partner.partner_users[0].mobile ? truck_info.partner.partner_users[0].mobile : '-'

  return (
    <Row>
      <LabelAndData
        label='Partner'
        data={
          <Link href='/partners/[id]' as={`/partners/${truck_info.partner && truck_info.partner.cardcode}`}>
            <h4><a>{truck_info.partner && truck_info.partner.name}</a></h4>
          </Link>
        }
        mdSpan={4}
        smSpan={8}
        xsSpan={12}
      />
      <LabelAndData
        label='Partner No'
        data={<Phone number={number} />}
        mdSpan={4}
        smSpan={8}
        xsSpan={12}
      />
      <LabelAndData
        label='City'
        data={
          <div>
            {truck_info.city && truck_info.city.name}
            <EditTwoTone
              onClick={() =>
                handleShow('editVisible', 'Breakdown', 'editData', truck_info.id)}
            />
          </div>}
        mdSpan={4}
        smSpan={8}
        xsSpan={12}
      />
      <LabelAndData
        label='Driver'
        data={
          <Driver partner_id={truck_info.partner.id} truck_id={truck_info.id} initialValue={driver_number} /> 
        }
        mdSpan={4}
        smSpan={8}
        xsSpan={12}
      />
     
      {object.editVisible && (
        <CreateBreakdown
          visible={object.editVisible}
          id={object.editData}
          onHide={handleHide}
          title={object.title}
        />
      )}
    </Row>
  )
}

export default Truck
