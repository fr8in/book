import React from 'react'
import {Row, Col,Switch} from 'antd'
import fuelDetail from '../../../mock/card/fuelCard'
export default function partnerfuelDetail () {
  
    return (
        <div>   
				<Row>
					<Col span={12}>
						<label><h5> Card ID  </h5></label>
					</Col>
					<Col span={12}>
						<p>{fuelDetail && fuelDetail.id}</p>
					</Col>
				</Row>
				<Row>
					<Col span={12}>
						<label><h5>Card Number</h5></label>
					</Col>
					<Col span={12}>
						<p>{ fuelDetail && fuelDetail.cardNumber}</p>
					</Col>
				</Row>
				<Row>
					<Col span={12}>
                        <label><h5>Balance</h5></label>
                    </Col>
                    <Col span={12}>
						<p>{ fuelDetail && fuelDetail.balance}</p>
					</Col>
				</Row>
				<Row>
					<Col span={12}>
						<label><h5> Linked Mobile </h5></label>
					</Col>
					<Col span={12}>
						<p>{ fuelDetail && fuelDetail.mobileNo}</p>
					</Col>
				</Row>
				<Row>
					<Col span={12}>
						<label><h5> Status </h5></label>
					</Col>
					<Col span={12}>
						<Switch size="small" defaultChecked />
					</Col>
				</Row>
               
        </div>
    )
}
