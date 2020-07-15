import React from 'react'
import {Row, Col} from 'antd'
import Detail from '../../../../mock/partner/partnerInfo'
export default function partnerBasicDetail() {
  
    return (
        <div>   
				<Row>
					<Col sm={12}>
						<label><h3> City </h3></label>
					</Col>
					<Col >
						<p>{Detail && Detail.city}</p>
					</Col>
				</Row>
				<Row>
					<Col sm={12}>
						<label><h3>Region</h3></label>
					</Col>
					<Col >
						<p>{ Detail && Detail.region}</p>
					</Col>
				</Row>
				<Row>
					<Col sm={12}>
                        <label><h3>On Boarded By</h3></label>
                    </Col>
                    <Col >
						<p>{ Detail && Detail.onBoardedBy}</p>
					</Col>
				</Row>
				<Row>
					<Col sm={12}>
						<label><h3>Final Payment Date</h3></label>
					</Col>
					<Col >
						<p>{ Detail && Detail.amount}</p>
					</Col>
				</Row>
				<Row>
					<Col sm={12}>
						<label><h3>Advance Percentage</h3></label>
					</Col>
					<Col >
						<p>{ Detail && Detail.advance}</p>
					</Col>
				</Row>   
        </div>
    )
}
