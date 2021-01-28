import {  Tooltip, Button, message } from 'antd'
import { CopyOutlined } from '@ant-design/icons'
import get from 'lodash/get'
import _ from 'lodash'
import CopyToClipboard from "react-copy-to-clipboard";
import { useState } from 'react'
import u from '../../lib/util'


const TrucksList = (props) => {
    const {record} = props
   
    const [copy, setCopy] = useState(false)

    const groupedData = _.groupBy(record, function(item) { return item.truck_type.name})

    console.log('groupedData',groupedData)

    const getMessage = (groupedData) => {
        let message = 'FR8 Trucks available at Kolkata \n';
        message += 'MXL: \n'
        message += `Partner: ${get(groupedData, 'partner.name')} \n`
        message += `Truck No: ${groupedData.truck_no} - ${get(groupedData, 'tat')} \n`;
        message += `O: ${get(groupedData, 'driver.mobile')} / D: ${get(groupedData, 'trips[0].driver.mobile')} \n`;
        message += `Last Comment: ${get(groupedData, 'last_comment.description') ? get(groupedData, 'last_comment.description') : '-'}`;
    
        return message; };
    
    const onCopy = () => {
     setCopy({copied:true})
     message.success('Copied!!')
    };

    return(
           <CopyToClipboard text={getMessage(groupedData)} onCopy={onCopy}>
            <Tooltip title='click to copy message'>
              <Button size='small' shape='circle' type='primary' icon={<CopyOutlined  />} />
            </Tooltip>
            </CopyToClipboard>
    )
}
export default TrucksList