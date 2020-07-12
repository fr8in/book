import React from 'react'
import {Row, Col} from 'antd'
import { Switch } from 'antd';


function onChange(checked) {
    console.log(`switch to ${checked}`);
  }
export default function partnerStatus() {
    return (
        <div>
            <Row>
               <h3> <Col>Wallet:</Col></h3>
                <Switch defaultChecked onChange={onChange} />
            </Row>
        </div>
    )
}
