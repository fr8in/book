import { Collapse, Input } from 'antd';
import Documents from '../../../components//partners/partnerDetail/document'
import FasTag from '../../cards/fasTag'
import FuelCard from '../../cards/fuelCard'
const { Panel } = Collapse;


const PartnerDocument = () =>{
    return (
  <Collapse accordion>
    <Panel header="Document" key="1">
     <Documents />
    </Panel>
    <Panel header="Fuel Detail" key="2">
      <FuelCard />
    </Panel>
    <Panel header="Fas Card" key="3">
   
      <span className='extra'>
      <Input placeholder='Search...' style={{ width: 'auto' }} />
      </span>
          
    <FasTag />
    </Panel>
  </Collapse>
    )
}

export default PartnerDocument