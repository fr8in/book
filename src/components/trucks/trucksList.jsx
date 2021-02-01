import {  Tooltip, Button, message } from 'antd'
import { CopyOutlined } from '@ant-design/icons'
import get from 'lodash/get'
import _ from 'lodash'
import isEmpty from 'lodash/isEmpty'
import CopyToClipboard from "react-copy-to-clipboard";
import { useState } from 'react'


const TrucksList = (props) => {
    const {trucks,branches} = props
   
    const [copy, setCopy] = useState(false)
  
    const groupedData = _.groupBy(trucks, function(item) { return item.truck_type.code})
    const branch_name = !isEmpty(branches) ? branches[0].name : null 

    const getMessage = (groupedData) => {
        let   message = `FR8 Trucks available at ${branch_name} \n \n`;
        let keys = Object.keys(groupedData)
        keys.forEach((key)=> {
          message = message + `${key} \n \n`
          let i = 1;
          groupedData[key].map((data)=>{
          message = message + `${i++}) Partner: ${get(data, 'partner.name')} \n`
          message = message + `Truck No: ${data.truck_no} - ${get(data, 'tat')} hrs \n`;
          message = message + `O: ${get(data, 'partner.partner_users[0].mobile') ? get(data, 'partner.partner_users[0].mobile') : '-'} / D: ${get(data, 'trips[0].driver.mobile') ? get(data, 'trips[0].driver.mobile') : '-'} \n`;
          message = message + `Comment: ${get(data, 'last_comment.description') ? get(data, 'last_comment.description') : '-'} \n \n`;
          })
          message = message  + '\n'
        })
         
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