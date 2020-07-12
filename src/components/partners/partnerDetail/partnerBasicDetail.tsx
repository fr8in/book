import React from 'react'
import {Row, Col} from 'antd'
import Detail from '../../../../mock/partner/partnerBasicDetail'
export default function partnerBasicDetail() {
  
    return (
        <div>
           
            <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }}>
                
				<Row>
					<Col span={10}>
						<label><h3> City </h3></label>
					</Col>
					<Col span={14}>
						<p>{Detail && Detail.city}</p>
					</Col>
				</Row>
				<Row>
					<Col span={10}>
						<label><h3>Region</h3></label>
					</Col>
					<Col span={14}>
						<p>{ Detail && Detail.region}</p>
					</Col>
				</Row>
				<Row>
					<Col span={10}>
                        <label><h3>On Boarded By</h3></label>
                    </Col>
                    <Col span={14}>
						<p>{ Detail && Detail.onBoardedBy}</p>
					</Col>
				</Row>
				<Row>
					<Col span={10}>
						<label><h3>Final Payment Date</h3></label>
					</Col>
					<Col span={14}>
						<p>{ Detail && Detail.amount}</p>
					</Col>
				</Row>
				<Row>
					<Col span={10}>
						<label><h3>Advance Percentage</h3></label>
					</Col>
					<Col span={14}>
						<p>{ Detail && Detail.advance}</p>
					</Col>
				</Row>
            </Col>	   
        </div>
    )
}
