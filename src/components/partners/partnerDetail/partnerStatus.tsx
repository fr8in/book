import React from 'react'
import { Checkbox} from 'antd'

function onChange(e) {
    console.log(`checked = ${e.target.checked}`);
  }
export default function partnerStatus() {
    return (
        <div>
             <div className='filterMenu'>
                  <Checkbox onChange={onChange}>BlockList</Checkbox>
                  <Checkbox onChange={onChange}>De-activate</Checkbox>
                  <Checkbox onChange={onChange}>DND</Checkbox>
              </div>
        </div>
    )
}
