import { useState } from 'react'
import { Row, Col, Radio } from 'antd'
import AdditionalAdvanceWallet from './additionalAdvanceWallet'
import AdditionalAdvanceBank from './additionalAdvanceBank'

const CreateAdditionalAdvance = (props) => {
  const { trip_info, setAdvanceRefetch, lock } = props

  const [radioValue, setRadioValue] = useState('WALLET')
  const onRadioChange = (e) => {
    setRadioValue(e.target.value)
  }
  return (
    <>
      <Row className='payableHead' gutter={6}>
        <Col xs={24}><b>Additional Advance</b></Col>
      </Row>
      <div className='p10'>
        <Row>
          <Col xs={24}>
            <Row className='mb10'>
              <Col xs={24}>
                <Radio.Group
                  onChange={onRadioChange}
                  value={radioValue}
                >
                  <Radio value='WALLET'>Wallet</Radio>
                  <Radio value='BANK'>Any Account</Radio>
                </Radio.Group>

              </Col>
            </Row>
            {radioValue === 'WALLET' ?
              <AdditionalAdvanceWallet trip_info={trip_info} setAdvanceRefetch={setAdvanceRefetch} lock={lock} radioValue = 'WALLET'/>
              : <AdditionalAdvanceBank trip_info={trip_info} setAdvanceRefetch={setAdvanceRefetch} lock={lock} radioValue = 'BANK'/>
            }
          </Col>
        </Row>
      </div>

    </>
  )
}

export default CreateAdditionalAdvance
