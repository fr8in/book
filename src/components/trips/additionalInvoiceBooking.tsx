import { useState } from 'react'
import { Modal, Button, Row, Col, Input, message, Table, Card, Divider } from 'antd'
import get from 'lodash/get'
import PaymentTraceability from '../customers/paymentTraceability'
import { gql, useMutation } from '@apollo/client'

const CUSTOMER_ADDITIONAL_INVOICE = gql`
mutation customer_additional_invoice(
    $trip_id: Int!, 
    $docentry: Int!,
    $wallet: Float!, 
    $write_off_docentry: Int!
    $created_by: String!, 
    $loading_charge_write_off: Float, 
    $unloading_charge_write_off: Float,
    $source_halting_write_off: Float,
    $destination_halting_write_off: Float
  ) {
  customer_additional_invoice(
    trip_id: $trip_id, 
    docentry: $docentry,
    wallet_amount: $wallet, 
    write_off_docentry: $write_off_docentry,  
    created_by: $created_by,
    loading_charge_write_off: $loading_charge_write_off,
    source_halting_write_off: $unloading_charge_write_off, 
    unloading_charge_write_off: $source_halting_write_off,
    destination_halting_write_off: $destination_halting_write_off
  ) {
    description
    status
  }
}`

const AdditionalInvoiceBooking = (props) => {
  const { visible, onHide, cardcode, mamul, price, pending_data, trip_id } = props

  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [selectedRow, setSelectedRow] = useState([])
  const [disableButton, setDisableButton] = useState(false)
  const [amount, setAmount] = useState(null)

  const [customer_additional_invoice] = useMutation(
    CUSTOMER_ADDITIONAL_INVOICE,
    {
      onError (error) {
        message.error(error.toString())
        setDisableButton(false)
      },
      onCompleted (data) {
        setDisableButton(false)
        const status = get(data, 'customer_additional_invoice.status', null)
        const description = get(data, 'customer_additional_invoice.description', null)
        if (status === 'OK') {
          setDisableButton(false)
          message.success(description || 'Processed!')
          onHide()
        } else (message.error(description))
      }
    }
  )

  const selectOnchange = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys)
    setSelectedRow(selectedRows)
    setDisableButton(!!(selectedRows && selectedRows.length === 0))
    setAmount(null)
  }

  const onAdditionInvoiceBooking = () => {
    const writeOff = pending_data.balance - (amount ? parseInt(amount, 10) : 0)
    customer_additional_invoice({
      variables: {
        trip_id: parseInt(trip_id),
        docentry: selectedRow[0].customer_incoming_id,
        wallet_amount: amount ? parseInt(amount) : 0,
        write_off_docentry: pending_data.docentry,
        created_by: 'karthik@fr8.in',
        loading_charge_write_off: pending_data.invoicetype === 'Loading Charges' ? writeOff : null,
        source_halting_write_off: pending_data.invoicetype === 'Source Halting' ? writeOff : null,
        unloading_charge_write_off: pending_data.invoicetype === 'Unloading Charges' ? writeOff : null,
        destination_halting_write_off: pending_data.invoicetype === 'Destination Halting' ? writeOff : null
      }
    })
  }

  const tableData = []
  tableData.push(pending_data)

  const column = [
    {
      title: 'Charges',
      dataIndex: 'invoicetype',
      width: '30%'
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      width: '30%'
    },
    {
      title: 'Write Off',
      width: '20%',
      render: (text, record) => (
        <Input
          value={record.balance - (amount ? parseInt(amount, 10) : 0)}
          type='number'
          disabled
          size='small'
        />)
    },
    {
      title: 'Paid',
      width: '20%',
      render: () => <Input size='small' value={amount ? parseInt(amount, 10) : 0} type='number' disabled />
    }
  ]

  return (
    <>
      <Modal
        title='Additional Invoice Booking'
        visible={visible}
        onCancel={onHide}
        maskClosable={false}
        bodyStyle={{ paddingBottom: 0 }}
        style={{ top: 20 }}
        width={850}
        footer={[]}
      >
        <PaymentTraceability
          selectedRowKeys={selectedRowKeys}
          selectOnchange={selectOnchange}
          cardcode={cardcode}
          amount={amount}
          setAmount={setAmount}
        />
        <Card className='mtb10 card-body-0'>
          <Table
            columns={column}
            dataSource={tableData}
            pagination={false}
            rowKey={record => record.trip_id}
            scroll={{ x: 400 }}
            size='small'
          />
        </Card>
        <Divider />
        <Row>
          <Col flex='auto'>
            <div>Total: <b>{amount || 0}</b></div>
            <p>Balance: <b>{pending_data.balance}</b>, (Recievables: <b>{price}</b>, Mamul: <b>{mamul}</b>)</p>
          </Col>
          <Col flex='100px' className='text-right'>
            <Button type='primary' onClick={onAdditionInvoiceBooking} loading={disableButton}>Book</Button>
          </Col>
        </Row>
      </Modal>
    </>
  )
}

export default AdditionalInvoiceBooking
