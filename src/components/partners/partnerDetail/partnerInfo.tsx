import React from 'react'
import {Row, Col} from 'antd'
import DetailInfo from '../../../../mock/partner/partnerDetailInfo'
export default function partnerDetailInfo () {
  
    return (
        <div>   
				<Row>
					<Col span={12}>
						<label><h5> On Boarded Date  </h5></label>
					</Col>
					<Col span={12}>
						<p>{DetailInfo && DetailInfo.date}</p>
					</Col>
				</Row>
				<Row>
					<Col span={12}>
						<label><h5>Email</h5></label>
					</Col>
					<Col span={12}>
						<p>{ DetailInfo && DetailInfo.mail}</p>
					</Col>
				</Row>
				<Row>
					<Col span={12}>
                        <label><h5>No.Of Trucks</h5></label>
                    </Col>
                    <Col span={12}>
						<p>{ DetailInfo && DetailInfo.truck}</p>
					</Col>
				</Row>
				<Row>
					<Col span={12}>
						<label><h5> Address </h5></label>
					</Col>
					<Col span={12}>
						<p>{ DetailInfo && DetailInfo.address}</p>
					</Col>
				</Row>
				<Row>
					<Col span={12}>
						<label><h5> State </h5></label>
					</Col>
					<Col span={12}>
						<p>{ DetailInfo && DetailInfo.state}</p>
					</Col>
				</Row>
                <Row>
					<Col span={12}>
						<label><h5> Bank </h5></label>
					</Col>
					<Col span={12}>
						<p>{ DetailInfo && DetailInfo.bank}</p>
					</Col>
				</Row>
                <Row>
					<Col span={12}>
						<label><h5> Account Number </h5></label>
					</Col>
					<Col span={12}>
						<p>{ DetailInfo && DetailInfo.accNo}</p>
					</Col>
				</Row>
                <Row>
					<Col span={12}>
						<label><h5> IFSC Code </h5></label>
					</Col>
					<Col span={12}>
						<p>{ DetailInfo && DetailInfo.IFSC}</p>
					</Col>
				</Row>
                <Row>
					<Col span={12}>
						<label><h5> Cibil Score </h5></label>
					</Col>
					<Col span={12}>
						<p>{ DetailInfo && DetailInfo.cibilScore}</p>
					</Col>
				</Row>
                <Row>
					<Col span={12}>
						<label><h5> EMI </h5></label>
					</Col>
				</Row>
                <Row>
					<Col span={12}>
						<label><h5> TDS % </h5></label>
					</Col>
					<Col span={12}>
						<p>{ DetailInfo && DetailInfo.TDS}</p>
					</Col>
				</Row>
                <Row>
					<Col span={12}>
						<label><h5> PAN </h5></label>
					</Col>
					<Col span={12}>
						<p>{ DetailInfo && DetailInfo.PAN}</p>
					</Col>
				</Row>
                <Row>
					<Col span={12}>
						<label><h5> GST </h5></label>
					</Col>
					<Col span={12}>
						<p>{ DetailInfo && DetailInfo.GST}</p>
					</Col>
				</Row>
                <Row>
					<Col span={12}>
						<label><h5> Mapped Customer </h5></label>
					</Col>
				</Row>       	   
        </div>
    )
}
