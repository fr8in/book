
import { Table, InputNumber, Row, Col, Space, Button } from 'antd';
import LabelWithData from '../../common/labelWithData';

import React, { useState } from 'react';
import isNil from 'lodash/isNil'
import util from '../../../lib/util'
import Link from 'next/link'




const RelianceCashBack = (props) => {
    const [process, setProcess] = useState(false)

   


    const dataSource = [
        {
            name: 'Ross Geller',
            cardcode: 'ST002638',
            consumption: 35000,
            cashback_amount: 23,
            cleared: 45,
            balance: 12,
        },
        {
            name: 'Chandler Bing',
            cardcode: 'ST002638',
            consumption: 35000,
            cashback_amount: 23,
            cleared: 45,
            balance: 12,
        },
        {
            name: 'Joey Tribiani',
            cardcode: 'ST002638',
            consumption: 35000,
            cashback_amount: 23,
            cleared: -45,
            balance: -12,
        },
        {
            name: 'Monica Geller',
            cardcode: 'ST002638',
            consumption: 35000,
            cashback_amount: 23,
            cleared: 45,
            balance: 12,
        },
        {
            name: 'Phoebe Buffay',
            cardcode: 'ST002638',
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
            dataIndex: 'cardcode'
            ,
            render: (text, record) => {
                return <Link href='/partners/[id]' as={`/partners/${text}`}>
                    {text}
                </Link>

            }

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
        isNil(props.month) ? <>
            <h4 align='center'>Reliance Fuel CashBack</h4>
        </> :
           
                <div>
                    {true && <div> <Table
                        rowClassName={(record, index) => record.cleared > 0 ? 'cashbackRow' : 'cashbackRowNegativeWallet'}
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

            
    )
}

export default RelianceCashBack