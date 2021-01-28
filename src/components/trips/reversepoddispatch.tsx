import { Modal,Row,Col , Radio} from 'antd'
import { useState} from 'react'
import Poddispaych from '../trips/reversepod'
import PODdispatch from './reversepoddispatch_trip_id'

const Reversepoddispatch = (props) => {
  const {visible, onHide} = props
  const [radioValue, setRadioValue] = useState('DOCKET NO')
  const onRadioChange = (e) => {
    setRadioValue(e.target.value)
  }

  return (
    <Modal
      title='Reverse POD Dispatch'
       visible={visible}
       onCancel={onHide}
      footer={[]}
    >
       <Row>
          <Col xs={24}>
            <Row className='mb10'>
              <Col xs={24}>
                <Radio.Group
                  onChange={onRadioChange}
                  value={radioValue}
                >
                  <Radio value='DOCKET NO'>Docket No</Radio>
                  <Radio value='Trip Id'>Trip Id</Radio>
                </Radio.Group>

              </Col>
            </Row>
            {radioValue === 'DOCKET NO' ?
              <Poddispaych  radioValue = 'DOCKET NO'  onHide={onHide}/>
              : <PODdispatch  radioValue = 'Trip Id' onHide={onHide}/>
            }
          </Col>
        </Row>
    </Modal>
  )
}
export default Reversepoddispatch
