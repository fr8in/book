
import { Table, Card, Input, InputNumber, Descriptions, Row, Col, Space, Button } from 'antd';
import LabelWithData from '../../common/labelWithData';

import React, { useState } from 'react';
import isNil from 'lodash/isNil'
import util from '../../../lib/util'




const RelianceCashBack = (props) => {
    const [process, setProcess] = useState(false)

    const [totalConsumption, setTotalConsumption] = useState<number>(178000)


    const [receivedCashBack, setReceivedCashBack] = useState<number>(0)

    const [blacklistedPartnerConsumption, setblacklistedPartnerConsumption] = useState<number>(0)


    const [receivedCashBackPercentage, setReceivedCashBackPercentage] = useState<number>(0)
    const [partnerCashBackPercentage, setpartnerCashBackPercentage] = useState<number>(0)
    const [partnerCashBackAmount, setpartnerCashBackAmount] = useState<number>(0)

    const [blacklistpartnerCashBackPercentage, setblackpartnerCashBackPercentage] = useState<number>(0)
    const [blacklistpartnerCashBackAmount, setblackpartnerCashBackAmount] = useState<number>(0)

    const [fr8CashBackAmount, setfr8CashBackAmount] = useState<number>(0)
    const [fr8CashBackPercentage, setfr8CashBackPercentage] = useState<number>(0)

    const isValidCashBack = () => isValidAmount(receivedCashBack) && isValidAmount(partnerCashBackPercentage)

    const isValidAmount = (amount) => util.isNumber(amount) && amount > 0

    const partnerCashBackOnChange = (value) => {

        setpartnerCashBackPercentage(parseFloat(value));
        let fr8CashBackPercentage = receivedCashBackPercentage - partnerCashBackPercentage

        setfr8CashBackPercentage(parseFloat(fr8CashBackPercentage.toFixed(2)));
        setfr8CashBackAmount(util.calculateAmountByPercentage(fr8CashBackPercentage, totalConsumption))
        
        let partnerCashBackAmount =  util.calculateAmountByPercentage(partnerCashBackPercentage, totalConsumption)
        setpartnerCashBackAmount(partnerCashBackAmount)
        
        let blacklistedCashbackPercent=  util.calculatePercentage(partnerCashBackAmount, 20).toFixed(2)
        setblackpartnerCashBackPercentage(parseFloat(blacklistedCashbackPercent))
        setblackpartnerCashBackAmount(util.calculateAmountByPercentage(blacklistedCashbackPercent, totalConsumption))
    
    }
    const receivedCashBackOnChange = (value) => {
        setReceivedCashBack(parseFloat(value));
        setReceivedCashBackPercentage(util.calculatePercentage(value, totalConsumption))

    }

    const cashBackdataSource = [
        {
            heading: 'Consumption',
            partner: '150000',
            blacklisted: '38000',
            fr8: totalConsumption
        },
        {
            heading: 'Cashback',
            partner: partnerCashBackAmount,
            blacklisted: blacklistpartnerCashBackAmount,
            fr8: fr8CashBackAmount
        },
        {
            heading: `Cashback Percentage - ${receivedCashBackPercentage}%`,
            blacklisted: `${blacklistpartnerCashBackPercentage}%`,
            fr8: `${fr8CashBackPercentage}%`
        },

    ];



    console.log("props in reliance", props)
    let { period } = props

    const cashBackcolumns = [
        {
            title: '',
            dataIndex: 'heading',
            render: (text, record) => {
                if (text === 'Cashback') {
                    return <div className='tableRowHeading' > {text}
                        <InputNumber
                            type='number'
                            placeholder='Received Cashback Amount'
                            min={0}
                            step={0.01}
                            onChange={(value) => receivedCashBackOnChange(value)}
                            style={{ width: 220, margin: "0 10px" }}
                        />
                    </div>
                }
                return <div className='tableRowHeading' > {text}</div>
            },
            width: '35%'

        },
        {
            title: 'Partner',
            dataIndex: 'partner',
            render: (text, record) => {
                console.log('record -in partner ', record.heading)

                if (record.heading.includes('Cashback Percentage')) {
                    return <InputNumber
                        type='number'
                        placeholder='Partner Cashback %'
                        min={0}
                        step={0.01}
                        onChange={(value) => partnerCashBackOnChange(value)}
                        style={{ width: 160, margin: "0 10px" }}
                    />
                }
                return text
            },
            width: '5%'

        },
        {
            title: 'Blacklisted',
            dataIndex: 'blacklisted',
            width: '5%'

        },
        {
            title: 'FR8',
            dataIndex: 'fr8',
            width: '5%'
        }
    ];


    const dataSource = [
        {
            name: 'Ross Geller',
            code: 'ST002638',
            consumption: 35000,
            cashback_amount: 23,
            cleared: 45,
            balance: 12,
        },
        {
            name: 'Chandler Bing',
            code: 'ST002638',
            consumption: 35000,
            cashback_amount: 23,
            cleared: 45,
            balance: 12,
        },
        {
            name: 'Joey Tribiani',
            code: 'ST002638',
            consumption: 35000,
            cashback_amount: 23,
            cleared: -45,
            balance: -12,
        },
        {
            name: 'Monica Geller',
            code: 'ST002638',
            consumption: 35000,
            cashback_amount: 23,
            cleared: 45,
            balance: 12,
        },
        {
            name: 'Phoebe Buffay',
            code: 'ST002638',
            consumption: 35000,
            cashback_amount: 23,
            cleared: 45,
            balance: 12,
        }
    ];

    const columns = [
        {
            title: 'Partner Name',
            dataIndex: 'name',

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
            title: 'Balance',
            dataIndex: 'balance'

        }

    ];


    return (
        isNil(period) ? <>
            <h4 align='center'>Reliance Fuel CashBack</h4>
        </> :
            <div>
                <div>
                    <Table

                        columns={cashBackcolumns}
                        dataSource={cashBackdataSource}
                        size='small'
                        scroll={{ x: 500 }}
                        bordered
                        pagination={false}

                    //rowKey={(record) => record.code}
                    />
                    <div>

                        <Row gutter={10} className='item'>
                            <Col flex='1800px' className='text-right'>
                                <Space>
                                    <LabelWithData
                                        label=''
                                        margin_bottom
                                        data={
                                            <Button type="primary" disabled={!isValidCashBack()} onClick={() => setProcess(true)} >Next</Button>
                                        }
                                        labelSpan={18}
                                    />
                                </Space>
                            </Col>
                        </Row>

                    </div>
                </div>
                <div>
                    {process && <div> <Table
                        rowClassName={(record, index) => record.cleared > 0 ? 'cashbackRow' : 'cashbackRowNegativeWallet'}
                        columns={columns}
                        dataSource={dataSource}
                        size='small'
                        scroll={{ x: 1156 }}
                        pagination={false}
                        rowKey={(record) => record.code}
                    />
                        <br />
                        <Row gutter={10} className='item'>
                            <Col flex='1800px' className='text-right'>
                                <Space>
                                    <LabelWithData
                                        label=''
                                        margin_bottom
                                        data={
                                            <Button type="primary" onClick={() => setProcess(true)} >Process</Button>
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