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

    console.log('branches',branches)

    const branch_data = !isEmpty(branches) ? branches.map((branch) =>{
      const truck_types = _.chain({data:branch}).flatMap('connected_cities').flatMap('cities').flatMap('trucks').groupBy('truck_type.code').value()
      return {
     name: branch.name,
     truck_types:truck_types
      }
    })  : []

    console.log('branch_data',branch_data)

const grouped_data = []
const branch_name = ''


    const getMeessage = (grouped_data) => {
        let   message = `FR8 Trucks available at ${branch_name} \n \n`;
        let keys = Object.values(grouped_data)
        console.log('keys',keys)
        
        keys.forEach((key)=> {
          message = message + `${key} \n \n`
          let i = 1;
          grouped_data[key].map((data)=>{
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
           <CopyToClipboard text={getMeessage(grouped_data)} onCopy={onCopy}>
            <Tooltip title='click to copy message'>
              <Button size='small' shape='circle' type='primary' icon={<CopyOutlined  />} />
            </Tooltip>
            </CopyToClipboard>
    )
}
export default TrucksList