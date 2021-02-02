import {  Tooltip, Button, message } from 'antd'
import { CopyOutlined } from '@ant-design/icons'
import get from 'lodash/get'
import _ from 'lodash'
import isEmpty from 'lodash/isEmpty'
import CopyToClipboard from "react-copy-to-clipboard";
import { useState } from 'react'
import u from '../../lib/util'


const TrucksList = (props) => {
    const {data,trucks,branches} = props
    const [copy, setCopy] = useState(false)

    const branch_data = !isEmpty(branches) ? branches.map((branch) =>{
      const truck_types = _.chain({data:branch}).flatMap('connected_cities').flatMap('cities').flatMap('trucks').groupBy('truck_type.code').value()
      return {
     name: branch.name,
     truck_types:truck_types
      }
    })  : []


const getMessage = (branch_data) => {
  let   message = ''
  message = branch_data.map((branch)=>{
    message = `FR8 Trucks available at ${branch.name} \n \n`;
    Object.entries(branch.truck_types).map(([key,value])=>{
     message += `${key} \n \n`
     let i = 1;
     const trucks = value.map((truck)=>{
      message = message + `${i++})  Partner: ${get(truck, 'partner.name')} \n`
       message = message + `Truck No: ${truck.truck_no} - ${get(truck, 'tat')} hrs \n`;
         message = message + `O: ${get(truck, 'partner.partner_users[0].mobile') ? get(truck, 'partner.partner_users[0].mobile') : '-'} / D: ${get(data, 'trips[0].driver.mobile') ? get(data, 'trips[0].driver.mobile') : '-'} \n`;
         message = message + `City: ${truck.city.name}  \n \n`;
     })
   })
    return message
  })
  const final_message = message.join(' ').trim()
  return message
}
  
    const onCopy = () => {
     setCopy({copied:true})
     message.success('Copied!!')
    };

    return(
           <CopyToClipboard text={getMessage(branch_data)} onCopy={onCopy}>
            <Tooltip title='click to copy message'>
              <Button size='small' shape='circle' type='primary' icon={<CopyOutlined  />} />
            </Tooltip>
            </CopyToClipboard>
    )
}
export default TrucksList