import { Row, Col, Input, Button, Checkbox, Space } from 'antd'
import InvoiceItem from './invoiceItem'

const TripInvoice = (props) => {
  return (
    <div className='invoice'>
      <Row gutter={6} className='item header'>
        <Col flex='auto'><label>Charges</label></Col>
        <Col flex='auto' className='text-right'>Amount</Col>
      </Row>
      <InvoiceItem
        itemName='Partner Price'
        amount={23000}
      />
      <InvoiceItem
        itemName='Mamul Charge'
        amount={0}
      />
      <InvoiceItem
        checkbox
        itemName='Loading Halting'
        dayInput
        ldId='loadingDays'
        fId='loadingHalting'
        // ldOnBlur={haltingCharges}
        splHalting='Customer Loading Halting'
        splId='customerLoadingHalting'
      />
      <InvoiceItem
        checkbox
        itemName='Unloading Halting'
        dayInput
        ldId='unloadingDays'
        fId='unloadingHalting'
        // ldOnBlur={haltingCharges}
        splHalting='Customer Unloading Halting'
        splId='customerUnloadingHalting'
        // disableSubmit={disableSubmit}
      />
      <InvoiceItem
        chargeIncluded
        itemName='Loading Charge'
        fId='loadingCharge'
        fInitialValue={0}
        // disableSubmit={disableSubmit}
      />
      <InvoiceItem
        chargeIncluded={false}
        itemName='Unloading Charge'
        fId='unloadingCharge'
        // disableSubmit={disableSubmit}
      />
      <InvoiceItem
        itemName='Other Charge'
        fId='otherCharge'
        // disableSubmit={disableSubmit}
      />
      <InvoiceItem
        itemName='LR Incentive'
        amount={21}
      />
      <InvoiceItem
        itemName='POD Incentive'
        amount={45}
      />
      <InvoiceItem
        itemName='Customer Balance'
        amount={200}
      />
      <InvoiceItem
        itemName='Commission Fee'
        amount={750}
      />
      <InvoiceItem
        itemName='On Hold'
        fId='amountOnHold'
      />
      <Row className='item'>
        <Col xs={24}>
          <Input
            id='billingComment'
            placeholder='Comment'
            type='textarea'
            name='billingComment'
          />
        </Col>
      </Row>
      <Row className='item'>
        <Col xs={24}>
          <Checkbox
            checked // ={state.checked}
          // onChange={onChangeRemark}
          >
            Confirm other charges booked for Customer/Partner
          </Checkbox>
        </Col>
      </Row>
      <Row className='item text-right'>
        <Col xs={24}>
          <Space>
            <Button
              type='primary'
            //   loading={state.onHoldCalc}
            //   onClick={calculateOnHold}
            >
            Calculate On-Hold
            </Button>
            <Button>Cancel</Button>
            <Button
              type='primary'
              htmlType='submit'
              disabled={false}
            //   onClick={handleSubmit}
            >Submit
            </Button>
          </Space>
        </Col>
      </Row>
    </div>
  )
}

export default TripInvoice
