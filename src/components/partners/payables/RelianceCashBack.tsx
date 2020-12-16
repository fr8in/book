
import { Table, Card, InputNumber, Row, Col, Space, Button } from 'antd';
import LabelWithData from '../../common/labelWithData';
import LabelAndData from '../../common/labelAndData';
import React, { useState } from 'react';


const RelianceCashBack = (props) => {
    const [process, setProcess] = useState(false)
    const [partnerCashBack, setpartnerCashBack] = useState<number>(0)

    console.log("props in reliance", props)
    let { proceed } = props

    const dataSource = [
        {
            name: 'Selvam Tkr',
            code: 'ST002638',
            consumption: 35000,
            cashback_amount: 23,
            cleared: 45,
            balance: 12,
        },
        {
            name: 'Salem Raja',
            code: 'ST002579',
            consumption: 25000,
            cashback_amount: 23,
            cleared: -12,
            balance: 9,
        },
    ];

    const columns = [
        {
            title: 'Partner Name',
            dataIndex: 'code',

        },
        {
            title: 'Partner Code',
            dataIndex: 'code'

        },
        {
            title: 'Consumption',
            dataIndex: 'consumption'
        },
        {
            title: 'CashBack',
            dataIndex: 'cashback_amount'
        },
        {
            title: 'Cleared',
            dataIndex: 'cleared'
        },
        {
            title: 'Balance',
            dataIndex: 'balance'

        }

    ];

    const cashBackOnChange = (value) => setpartnerCashBack(value)

    return (
        proceed === false ? <>
           <h4 align='center'>Reliance Fuel CashBack</h4>
        </> :
            <div>
                <Row>
                    <Col span={12}>
                        <LabelWithData
                            label='Total Consumption'
                            data={<span>{60000}</span>}
                            labelSpan={8}
                        />
                        <LabelWithData
                            label='Received CashBack Amount'
                            data={<span>{'1021'}</span>}
                            labelSpan={8}
                        />
                        <LabelWithData
                            label='Received CashBack Percentage'
                            data={<span>{'1.45%'}</span>}
                            labelSpan={8}
                        />
                        <LabelWithData
                            label='Partner CashBack'
                            margin_bottom
                            data={
                                <InputNumber style={{ width: 70 }}
                                    type='number'
                                    defaultValue={0}
                                    min={0.01}
                                    step={0.01}
                                    size={'small'}
                                    onChange={(value)=>cashBackOnChange(value)  }
                                />
                            }
                            labelSpan={8}
                        />

                        <LabelWithData
                            label=''
                            margin_bottom
                            data={
                                <Button type="primary" onClick={() => setProcess(true)} >Process</Button>
                            }
                            labelSpan={8}
                        />

                    </Col>

                    <Col span={12}>
                        <Row>
                            <Col span={12}>
                                <h5>Partner</h5>
                                <LabelWithData
                                    label='CashBack Amount'
                                    data={<span>{60}</span>}
                                    labelSpan={12}
                                />
                                <LabelWithData
                                    label='CashBack Percentage'
                                    data={<span>{partnerCashBack}</span>}
                                    labelSpan={12}
                                />

                            </Col>
                            <Col span={12}>
                                <h5>FR8</h5>
                                <LabelWithData
                                    label='CashBack Amount'
                                    data={<span>{30}</span>}
                                    labelSpan={12}
                                />
                                <LabelWithData
                                    label='CashBack Percentage'
                                    data={<span>{(1.45 - partnerCashBack).toFixed(2)}</span>}
                                    labelSpan={12}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <div>
                    {process && <div> <Table
                        rowClassName={(record, index) => record.cleared > 0 ? 'tr1' : 'tr2'}
                        columns={columns}
                        dataSource={dataSource}
                        size='small'
                        scroll={{ x: 1156 }}
                        pagination={false}
                        rowKey={(record) => record.code}
                    />
                    <br/>
                        <Row gutter={10} className='item'> 
                            <Col flex='1800px' className='text-right'>
                                <Space>
                                    <LabelWithData
                                        label=''
                                        margin_bottom
                                        data={
                                            <Button type="primary" onClick={() => setProcess(true)} >Transfer to wallet</Button>
                                        }
                                        labelSpan={12}
                                    />
                                </Space>
                            </Col>
                        </Row>
                    </div>
                    }
                </div>

            </div>
    )
}

export default RelianceCashBack