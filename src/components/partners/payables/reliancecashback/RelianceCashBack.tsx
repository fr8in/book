
import { Table, Modal, Row, Col, Space, Button } from 'antd';
import LabelWithData from '../../../common/labelWithData';

import React, { useState } from 'react';
import isNil from 'lodash/isNil'
import get from 'lodash/get'
import Link from 'next/link'
import { gql, useMutation, useQuery } from '@apollo/client'
import Process from './process'

const reliance_cashback = gql`
query reliance_cashback($year: Int!, $month: Int!) {
    reliance_cashback(year: $year, month: $month) {
      partner_id
      walletcode
      status
      consumption
      percentage
      amount
      status
      cardcode
      balance
    }
  }
  `

const RelianceCashBack = (props) => {

    let { month, year } = props
    console.log('month - ', month, 'year', year)
    const [process, setProcess] = useState(false)

    const { loading, error, data, refetch } = useQuery(
        reliance_cashback, {
        variables: { year, month },
        fetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true
    }
    )

    let _data = []
    if (!loading) {
        _data = data
    }
    const relianceCashback = get(_data, 'reliance_cashback', [])
    console.log('relianceCashback ', relianceCashback)

    const columns = [
        {
            title: 'Partner Code',
            dataIndex: 'cardcode',
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
            dataIndex: 'amount'
        },
        {
            title: 'Percentage',
            dataIndex: 'percentage'
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
                    rowClassName={(record, index) => record.balance > 0 ? 'cashbackRow' : 'cashbackRowNegativeWallet'}
                    columns={columns}
                    dataSource={relianceCashback}
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

                {process && (
                    <Process
                        visible={process}
                        title={'Reliance CashBack'}
                        month={month}
                        year={year}
                    />
                )}


            </div>


    )
}

export default RelianceCashBack