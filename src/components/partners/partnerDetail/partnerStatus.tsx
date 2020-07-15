import React from 'react'
import { Checkbox ,Card, Row, Col} from 'antd'

function onChange(e) {
    console.log(`checked = ${e.target.checked}`);
  }
export default function partnerStatus() {
    return (
        <div>
            <Card.Grid>
             <div className='filterMenu'>
                 <Row>
                     <Col>
                  <Checkbox onChange={onChange}>BlockList</Checkbox>
                  </Col>
                  <Col>
                  <Checkbox onChange={onChange}>De-activate</Checkbox>
                  </Col>
                  <Col>
                  <Checkbox onChange={onChange}>DND</Checkbox>
                  </Col>
                  </Row>
              </div>
              </Card.Grid>
        </div>
    )
}
