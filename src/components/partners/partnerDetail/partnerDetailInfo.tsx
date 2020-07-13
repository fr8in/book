import React from 'react'
import {Row, Col} from 'antd'
import DetailInfo from '../../../../mock/partner/partnerDetailInfo'
export default function partnerDetailInfo () {
  
    return (
        <div>   
				<Row>
					<Col span={18}>
						<label><h3> On Boarded Date  </h3></label>
					</Col>
					<Col span={6}>
						<p>{DetailInfo && DetailInfo.date}</p>
					</Col>
				</Row>
				<Row>
					<Col span={18}>
						<label><h3>Email</h3></label>
					</Col>
					<Col span={6}>
						<p>{ DetailInfo && DetailInfo.mail}</p>
					</Col>
				</Row>
				<Row>
					<Col span={18}>
                        <label><h3>No.Of Trucks</h3></label>
                    </Col>
                    <Col span={6}>
						<p>{ DetailInfo && DetailInfo.truck}</p>
					</Col>
				</Row>
				<Row>
					<Col span={18}>
						<label><h3> Address </h3></label>
					</Col>
					<Col span={6}>
						<p>{ DetailInfo && DetailInfo.address}</p>
					</Col>
				</Row>
				<Row>
					<Col span={18}>
						<label><h3> State </h3></label>
					</Col>
					<Col span={6}>
						<p>{ DetailInfo && DetailInfo.state}</p>
					</Col>
				</Row>
                <Row>
					<Col span={18}>
						<label><h3> Bank </h3></label>
					</Col>
					<Col span={6}>
						<p>{ DetailInfo && DetailInfo.bank}</p>
					</Col>
				</Row>
                <Row>
					<Col span={18}>
						<label><h3> Account Number </h3></label>
					</Col>
					<Col span={6}>
						<p>{ DetailInfo && DetailInfo.accNo}</p>
					</Col>
				</Row>
                <Row>
					<Col span={18}>
						<label><h3> IFSC Code </h3></label>
					</Col>
					<Col span={6}>
						<p>{ DetailInfo && DetailInfo.IFSC}</p>
					</Col>
				</Row>
                <Row>
					<Col span={18}>
						<label><h3> Cibil Score </h3></label>
					</Col>
					<Col span={6}>
						<p>{ DetailInfo && DetailInfo.cibilScore}</p>
					</Col>
				</Row>
                <Row>
					<Col span={18}>
						<label><h3> EMI </h3></label>
					</Col>
				</Row>
                <Row>
					<Col span={18}>
						<label><h3> TDS % </h3></label>
					</Col>
					<Col span={6}>
						<p>{ DetailInfo && DetailInfo.TDS}</p>
					</Col>
				</Row>
                <Row>
					<Col span={18}>
						<label><h3> PAN </h3></label>
					</Col>
					<Col span={6}>
						<p>{ DetailInfo && DetailInfo.PAN}</p>
					</Col>
				</Row>
                <Row>
					<Col span={18}>
						<label><h3> GST </h3></label>
					</Col>
					<Col span={6}>
						<p>{ DetailInfo && DetailInfo.GST}</p>
					</Col>
				</Row>
                <Row>
					<Col span={18}>
						<label><h3> Mapped Customer </h3></label>
					</Col>
				</Row>       	   
        </div>
    )
}
