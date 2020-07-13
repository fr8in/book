import { Collapse } from 'antd';

const { Panel } = Collapse;


const PartnerDocument = () =>{
    return (
  <Collapse accordion>
    <Panel header="Document" key="1">
      <p>Document</p>
    </Panel>
    <Panel header="Fuel Detail" key="2">
      <p>Fuel Detail</p>
    </Panel>
    <Panel header="Fas Card" key="3">
      <p>Fas Card</p>
    </Panel>
  </Collapse>
    )
}

export default PartnerDocument