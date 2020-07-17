import { Row, Col, Space } from 'antd'
import LabelWithData from '../common/labelWithData'
import Detail from '../../../mock/partner/partnerInfo'


const partnerInfo = () => {

	return (
		<Row gutter={8}>
			<Col xs={24} sm={24} md={24}>
				<LabelWithData
					label='City'
					data={
						<Space>
							<span>{Detail.city}</span>
						</Space>
					}
					labelSpan={10}
					dataSpan={14}
				/>
				<LabelWithData
					label='Region'
					data={
						<Space>
							<span>{Detail.region}</span>
						</Space>
					}
					labelSpan={10}
					dataSpan={14}
				/>
				<LabelWithData
					label='On Boarded By'
					data={
						<Space>
							<span>{Detail.onBoardedBy}</span>
						</Space>
					}
					labelSpan={10}
					dataSpan={14}
				/>
				<LabelWithData
					label='Amount'
					data={
						<Space>
							<span>{Detail.amount}</span>
						</Space>
					}
					labelSpan={10}
					dataSpan={14}
				/>
				<LabelWithData
					label='Advance Percentage'
					data={
						<Space>
							<span>{Detail.advance}</span>
						</Space>
					}
					labelSpan={10}
					dataSpan={14}
				/>
			</Col>
		</Row>
	)
}
export default partnerInfo