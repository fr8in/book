import React from 'react'
import { Switch } from 'antd';


function onChange(checked) {
    console.log(`switch to ${checked}`);
  }
export default function partnerStatus() {
    return (
        <div>
               <h3> Wallet:<Switch defaultChecked onChange={onChange} /></h3>
        </div>
    )
}
