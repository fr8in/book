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
                  <Checkbox onChange={onChange}>BlockList </Checkbox> 
                  <Checkbox onChange={onChange}> De-activate</Checkbox>
                  <Checkbox onChange={onChange}>DND </Checkbox>             
                </Space>
            </Row>
              </div>
              </Card>
        </div>
    )
}
