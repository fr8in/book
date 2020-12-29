
import { Table, message, Row, Col, Space, Button } from 'antd';
import LabelWithData from '../../../common/labelWithData';

import React, { useState } from 'react';
import isNil from 'lodash/isNil'
import get from 'lodash/get'
import Link from 'next/link'
import { gql, useMutation, useQuery } from '@apollo/client'
import Process from './process'
import useShowHideWithRecord from '../../../../hooks/useShowHideWithRecord';
import now from 'lodash/now'


const reliance_cashback = gql`
query reliance_cashback${now()}($year: Int!, $month: Int!) {
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
    let { month, year, setMonth, setYear } = props
    console.log('month - ', month, 'year', year)

    const { loading, error, data } = useQuery(
        reliance_cashback, {
        variables: { year, month },
        fetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
        onError(error) {
            message.error(error.message.toString())
        },
    }
    )

    let _data = []
    if (!loading) {
        _data = data
    }

    const initial = { visible: false }

    const { object, handleHide, handleShow } = useShowHideWithRecord(initial)


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
            dataIndex: 'balance',
            render: (text, record) => text.toFixed(2)
        }

    ];
    return (
        <div>
            {true && <div> <Table
                rowClassName={(record, index) => record.balance > 0 ? 'cashbackRow' : 'cashbackRowNegativeWallet'}
                columns={columns}
                dataSource={relianceCashback}
                size='small'
                scroll={{ x: 1156 }}
                pagination={false}
                rowKey={(record) => record.cardcode}
            />
                <br />
                <Row gutter={10} className='item'>
                    <Col flex='1800px' className='text-right'>
                        <Space>
                            <LabelWithData
                                label=''
                                margin_bottom
                                data={
                                    relianceCashback.length > 0 && <Button type="primary"
                                        onClick={() => handleShow('visible', '', '', {})} >Next</Button>
                                }
                                labelSpan={1}
                            />
                        </Space>
                    </Col>
                </Row>
            </div>
            }

            {object.visible && (
                <Process
                    visible={object.visible}
                    onHide={handleHide}
                    title={'Reliance CashBack'}
                    month={month}
                    year={year}
                    setMonth={setMonth}
                    setYear={setYear}
                />
            )}
        </div>


    )
}



export default RelianceCashBack