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
        let   message = 'FR8 Trucks available at Kolkata \n';
        let key = Object.keys(groupedData)
        key.forEach((type)=> {
          message = `${type} \n`
          let i = 1;
          groupedData[type].map((data)=>{
            console.log("type,data",data)
            // message += ${type}: \n
          message += `${i++}) Partner: ${get(data, 'partner.name')  ? get(data, 'partner.name') : '-'}\n`
          message += `Truck No: ${get(data, 'truck_no') ?  get(data, 'truck_no') : '-' }- ${get(data, 'tat') ? get(data, 'tat') : '-'} \n`;
          message += `O: ${get(data, 'driver.mobile') ?  get(data, 'driver.mobile') : '-'} / D: ${get(data, 'trips[0].driver.mobile') ? get(data, 'trips[0].driver.mobile') : '-' } \n`;
          message += `Last Comment: ${get(data, 'last_comment.description') ? get(data, 'last_comment.description') : '-'} \n`;
          })
          message = message 
        })
          console.log("message",message)
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