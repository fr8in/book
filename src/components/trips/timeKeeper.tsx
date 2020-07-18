import { Row, Col, Card, Form, DatePicker, Tooltip } from 'antd'

const TimeKeeper = () => {
  return (
    <Card className='dashBoardcard'>
        time Stamp
      {/* <Row className='SDInOut'>
        <Col xs={{ span: 24 }} sm={{ span: 8 }}>
          <Form.Item label='Source In' {...styles.formCityLayout}>
            {getFieldDecorator(...u.genNotRequiredRule('sdatein', 'Source In', editData.sdatein ? moment(editData.sdatein) : null))(
              <DatePicker
                showTime format='DD-MMM-YYYY HH:mm'
                placeholder='Select Time'
                style={{ width: '100%' }}
                disabled={editData.viewOnly}
              />)}
          </Form.Item>
        </Col>
        <Col xs={{ span: 24 }} sm={{ span: 8 }}>
          <Form.Item label='Source Out' {...styles.formCityLayout}>
            <Tooltip
              title={editData.sdateout ? '' : 'Stop! Ask partner to upload LR'}
            > {getFieldDecorator(...u.genNotRequiredRule('sdateout', 'Source Out', editData.sdateout ? moment(editData.sdateout) : null))(
              <DatePicker
                  showTime format='DD-MMM-YYYY HH:mm'
                  placeholder='Select Time'
                  style={{ width: '100%' }}
                  disabled={editData.viewOnly}
                />)}
            </Tooltip>
          </Form.Item>
        </Col>
        <Col xs={{ span: 24 }} sm={{ span: 6 }}>
          <Tooltip
            trigger={['hover']}
            title={mobileFormat}
            placement='top'
            overlayClassName='numeric-input'
          >
            <InputComponent
              id='driverNumber' label='Driver Phone'
              itemProps={{ ...styles.formCityLayout }}
              form={this.props.form}
              initialValue={editData.driver} maxLength='10'
              disabled={editData.viewOnly}
            />
          </Tooltip>
        </Col>
        <Col xs={{ span: 24 }} sm={{ span: 2 }}>
          {!editData.viewOnly && <FontAwesome
            className='btn btn-sm btn-primary blue-btn1 labelFix'
            style={{ fontSize: '14px' }}
            name='save'
            onClick={this.updateDriverDetails}
                                 />}
        </Col>
      </Row>
      <Row />
      <Row className='SDInOut'>
        <Col xs={{ span: 24 }} sm={{ span: 8 }}>
          <Form.Item label='Destination In' {...styles.formCityLayout}>
            {getFieldDecorator(...u.genNotRequiredRule('ddatein', 'Destination In', editData.ddatein ? moment(editData.ddatein) : null))(
              <DatePicker
                showTime format='DD-MMM-YYYY HH:mm'
                placeholder='Select Time'
                style={{ width: '100%' }}
                disabled={editData.viewOnly}
              />)}
          </Form.Item>
        </Col>
        <Col xs={{ span: 12 }} sm={{ span: 8 }}>
          <Form.Item label='Destination Out' {...styles.formCityLayout}>
            <Tooltip
              title={editData.ddateout ? '' : 'Stop! Ask partner to upload POD'}
            > {getFieldDecorator(...u.genNotRequiredRule('ddateout', 'Destination Out', editData.ddateout ? moment(editData.ddateout) : null))(
              <DatePicker
                  showTime format='DD-MMM-YYYY HH:mm'
                  placeholder='Select Time'
                  style={{ width: '100%' }}
                  disabled={editData.viewOnly}
                  onChange={this.handleDdateOut}
                />)}
            </Tooltip>
          </Form.Item>
        </Col>
        <Col xs={{ span: 24 }} sm={{ span: 8 }} style={{ marginTop: '10px' }}>
          <label>Loading Memo</label>
          <div>
            <a
              className='btn btn-sm btn-primary blue-btn1 labelTop'
              style={{ fontSize: '14px', ...styles.formCityLayout }}
              onClick={this.handleLrUrl}
              target='_blank'
            >
              <Tooltip title='PDF'> <Icon
                type='file-pdf'
                theme='filled'
                                    />
              </Tooltip>
            </a>
            <span className='ant-divider' />
            <a
              className='btn btn-sm btn-primary blue-btn1 labelTop'
              style={{ fontSize: '14px', ...styles.formCityLayout }}
              onClick={this.handleWordUrl}
              // target="_blank"
            >
              <Tooltip title='WORD'> <Icon
                type='file-word'
                theme='filled'
                                     />
              </Tooltip>
            </a>
            <span className='ant-divider' />
            <span>
              <FontAwesome
                className='btn btn-sm btn-primary blue-btn1 labelTop'
                style={{ fontSize: '14px' }}
                name='envelope'
                onClick={this.handleMemoEmail.bind(this, true)}
              />
            </span>
          </div>
          <Modal
            title='Loading Memo Email'
            visible={this.state.memoEmail}
            onOk={this.sendLoadingMemoMail}
            onCancel={this.handleMemoEmail.bind(this, false)}
            okText='Send'
          >
            <InputComponent
              id='loadingMemoEmail' type='email'
              placeholder='Email address'
              name='loadingMemoEmail'
              form={this.props.form}
              itemProps={{ ...styles.formCityLayout }}
            />
          </Modal>
        </Col>
      </Row>
      {editData.tripStatus === 5 || (editData.orderStatusTypeId >= 11)
        ? <Row>
          <Col xs={{ span: 24 }} sm={{ span: 8 }}>
            <InputComponent
              label='To-Pay Amount' id='toPayAmount' form={this.props.form}
              itemProps={{ ...styles.formCityLayout }}
              initialValue={customerAdvance && customerAdvance.customerToPayAdvance
                ? customerAdvance.customerToPayAdvance.amount : null}
              type='number'
              name='toPayAmount'
              disabled={editData.cToPayAmount && editData.cToPayAmount > 0 && doutValue && toPayEditAccess ? editData.viewOnly : true}
              required={!!(editData.cToPayAmount && editData.cToPayAmount > 0 && doutValue)}
            />
          </Col>
          <Col xs={{ span: 24 }} sm={{ span: 16 }}>
            <InputComponent
              label='To-Pay Comment' id='toPayComment' form={this.props.form}
              itemProps={{ ...styles.formCityLayout }}
              initialValue={customerAdvance && customerAdvance.customerToPayAdvance ? customerAdvance.customerToPayAdvance.remarks : null}
              name='toPayComment'
              disabled={editData.cToPayAmount && editData.cToPayAmount > 0 && doutValue ? editData.viewOnly : true}
              required={!!(editData.cToPayAmount && editData.cToPayAmount > 0 && doutValue)}
            />
          </Col>
          </Row> : ''}
      <Row>
        {this.props.editData && this.props.editData.onHoldTripId
          ? <Checkbox
            checked='true' onChange={this.checkedPrivateGodown}
            disabled={disableDefaultOnHoldTrip}
          >Unloaded at private
                                                        godown
          </Checkbox>
          : <Checkbox
            onChange={this.checkedPrivateGodown}
            disabled={disableDefaultOnHoldTrip}
            >Unloaded at private
                                                        godown
          </Checkbox>}
        <Col span={24} className='receiptDiv'>
          {this.props.editData && this.props.editData.onHoldTripAddress}<br />
          {defaultOnHoldTrip && <a
            target='_blank'
            className='btn btn-sm btn-primary addButton1 receipt1'
            onClick={() => u.downloadFile(receiptName, 'warehousereceipt/')}
                                ><Icon
            type='download'
          />Receipt
          </a>}
        </Col>
      </Row>
      <Row>
        <Col xs={{ span: 24 }} sm={{ span: 14 }}>
          {((editData.tripStatus === 2 || editData.tripStatus === 1 || editData.tripStatus === 7) && !editData.sdateout)
            ? <NewDeletePoContainer
              tripId={editData.tripId}
              deviceId={editData.deviceId}
            /> : ''}
          {this.state.processAdvance
            ? <span>
              <NewProcessPartnerAdvance
                processAdvance={this.state.processAdvance}
                loadId={editData.tripId}
                lrUrl={editData.lrUrl}
                customerConfirmation={this.state.customerConfirmation}
              />
              <span className='ant-divider' />
              </span>
            : ''}
          {editData.tripStatus === 3 && sOutRemovalAccess
            ? <Button
              type='danger' size='large'
              onClick={this.removeSout.bind(this)}
            >Remove
                                                            S-Out
            </Button> : ''}
          {editData.tripStatus === 5 && (editData.orderStatusTypeId < 13) && sOutRemovalAccess
            ? <Button
              type='danger' size='large'
              onClick={this.removeDout.bind(this)}
            >Remove
                                                            D-out
            </Button> : ''}
        </Col>

        <Col xs={{ span: 24 }} sm={{ span: 10 }} className='text-right trip-action'>
          <Form.Item>
            {editData.tripStatus === 4 && toPayPrice > 0
              ? <Button
                type='primary'
                onClick={this.showLoadCreationModal.bind(this, true)}
                disabled={editData.viewOnly || this.state.submitDisabled}
              >Submit
              </Button>
              : <Button
                type='primary'
                onClick={this.handleSubmit.bind(this)}
                disabled={editData.viewOnly || this.state.submitDisabled}
              >Submit
              </Button>}
            <span className='ant-divider' />
            <Button
              className='ant-btn cancelButton ant-btn1'
              onClick={browserHistory.goBack}
            >Cancel
            </Button>
          </Form.Item>
        </Col>
      </Row> */}
    </Card>
  )
}

export default TimeKeeper
