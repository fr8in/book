import { Row, Col, Space } from 'antd'
import LabelWithData from '../common/labelWithData'
import DetailInfo from '../../../mock/partner/partnerDetailInfo'
export default function partnerDetailInfo() {

	return (
		<Row gutter={8}>
			<Col xs={24} sm={24} md={24}>
				<LabelWithData
					label='On Boarded Date'
					data={
						<Space>
							<span>{DetailInfo.date}</span>
						</Space>
					}
					labelSpan={10}
					dataSpan={14}
				/>
				<LabelWithData
					label='Email'
					data={
						<Space>
							<span>{DetailInfo.mail}</span>
						</Space>
					}
					labelSpan={10}
					dataSpan={14}
				/>
				<LabelWithData
					label='No.Of Trucks'
					data={
						<Space>
							<span>{DetailInfo.truck}</span>
						</Space>
					}
					labelSpan={10}
					dataSpan={14}
				/>
				<LabelWithData
					label=' Address'
					data={
						<Space>
							<span>{DetailInfo.address}</span>
						</Space>
					}
					labelSpan={10}
					dataSpan={14}
				/>
				<LabelWithData
					label='State'
					data={
						<Space>
							<span>{DetailInfo.state}</span>
						</Space>
					}
					labelSpan={10}
					dataSpan={14}
				/>

				<LabelWithData
					label='Bank'
					data={
						<Space>
							<span>{DetailInfo.bank}</span>
						</Space>
					}
					labelSpan={10}
					dataSpan={14}
				/>
				<LabelWithData
					label='Account Number '
					data={
						<Space>
							<span>{DetailInfo.accNo}</span>
						</Space>
					}
					labelSpan={10}
					dataSpan={14}
				/>
				<LabelWithData
					label='IFSC Code'
					data={
						<Space>
							<span>{DetailInfo.IFSC}</span>
						</Space>
					}
					labelSpan={10}
					dataSpan={14}
				/>
				<LabelWithData
					label='Cibil Score '
					data={
						<Space>
							<span>{DetailInfo.cibilScore}</span>
						</Space>
					}
					labelSpan={10}
					dataSpan={14}
				/>
				<LabelWithData
					label='EMI'
					data={
						<Space>

						</Space>
					}
					labelSpan={10}
					dataSpan={14}
				/>
				<LabelWithData
					label=' TDS %'
					data={
						<Space>
							<span>{DetailInfo.TDS}</span>
						</Space>
					}
					labelSpan={10}
					dataSpan={14}
				/>
				<LabelWithData
					label='PAN'
					data={
						<Space>
							<span>{DetailInfo.PAN}</span>
						</Space>
					}
					labelSpan={10}
					dataSpan={14}
				/>
				<LabelWithData
					label=' GST'
					data={
						<Space>
							<span>{DetailInfo.GST}</span>
						</Space>
					}
					labelSpan={10}
					dataSpan={14}
				/>
			</Col>
		</Row>


	)
}
