
import LabelAndData from '../common/labelAndData'
import Link from 'next/link'
import data from '../../../mock/trucks/truckDetail'
import { Row,Col,Button} from "antd";
import { PhoneOutlined} from '@ant-design/icons'

const Truck = (props) => {
  const { truckInfo } = props
  console.log('id', props)

  const callNow = data => {
    window.location.href = 'tel:' + data
  }
  
    return (
        <div>
            <Row gutter={10}>
              <Col span={8}>
                <LabelAndData
                colSpan={6}
                data={
                  <Link href='/partners/[id]' as={`/partners/${truckInfo.partner.name}`}>
                   <h1> <a>{truckInfo.partner.name}</a> </h1>
                  </Link> 
                }
              />
              </Col>
              <Col span={8}>
             <LabelAndData
                colSpan={12}
                data={truckInfo.truck_no }
              />
             </Col>
             <Col span={8}>
             <LabelAndData
                colSpan={12}
                data={truckInfo.city.name }
              />
             </Col>
             </Row>
             <Row gutter={10}>
             <Col span={8}>
             <LabelAndData
                colSpan={12}
                data= { 
                <span  onClick={() => callNow(truckInfo.driver.mobile_no)} className='link'><Button type='link' icon={<PhoneOutlined />}/>{truckInfo.driver.mobile_no}</span>
              }
              />
              
             </Col>
             <Col span={8}>
             <LabelAndData
                colSpan={12}
                data={truckInfo.truck_type.value}
              />
             </Col>
             <Col span={8}>
             <LabelAndData
                colSpan={12}
                data={data.truck.tat }
              />
             </Col>
             </Row>
              
        </div>
    )
}

export default Truck
