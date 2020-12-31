import { useState, useContext } from 'react'
import { Row, Col, Radio, Form, Input, Button, message, Popconfirm } from 'antd'
import { gql, useMutation, useLazyQuery, useQuery } from '@apollo/client'
import get from 'lodash/get'
import userContext from '../../lib/userContaxt'
import u from '../../lib/util'
import sumBy from 'lodash/sumBy'
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
