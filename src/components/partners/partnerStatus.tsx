import React from 'react'
import { Checkbox ,Card, Row,Space,Col} from 'antd'

function onChange(e) {
    console.log(`checked = ${e.target.checked}`);
  }
export default function partnerStatus() {
    return (
        <div>
            <Card>
             <div className='filterMenu'>
            <Row>
            <Col span={8}><Checkbox onChange={onChange}>BlockList </Checkbox> </Col>
            <Col span={9}><Checkbox onChange={onChange}> De-activate</Checkbox></Col>
            <Col span={7}><Checkbox onChange={onChange}>DND </Checkbox> </Col>   
            </Row>
              </div>
              </Card>
        </div>
    )
}
