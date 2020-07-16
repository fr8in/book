import React from 'react'
import { Checkbox ,Card, Row,Space} from 'antd'

function onChange(e) {
    console.log(`checked = ${e.target.checked}`);
  }
export default function partnerStatus() {
    return (
        <div>
            <Card>
             <div className='filterMenu'>
                 <Row>
                     <Space>
                    <Row>
                  <Checkbox onChange={onChange}>BlockList </Checkbox> 
                 </Row>
                
                 <Row>
                  <Checkbox onChange={onChange}> De-activate</Checkbox>
                 </Row>
                 <Row>
                  <Checkbox onChange={onChange}>DND </Checkbox>
                 </Row>
                 </Space>
                  </Row>
              </div>
              </Card>
        </div>
    )
}
