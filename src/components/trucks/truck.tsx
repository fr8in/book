import React from 'react'
import LabelAndData from '../common/labelAndData'
import Link from 'next/link'
import data from '../../../mock/trucks/truckDetail'


const Truck = (props) => {
  console.log('id', props)
  const title = (
    <h3>
      <span className='text-primary'>{props.id}</span>
      <span>&nbsp;{`${data.truck.phonenumber}  ${data.truck.truckid}  ${data.truck.trucktype} ${data.truck.destination} ${data.truck.tat}`}&nbsp;</span>
    </h3>)


    return (
        <div>
            
                <LabelAndData
                colSpan={6}
                data={
                  <Link href='/partners/[id]' as={`/partners/${'Vijay'}`}>
                   <h1> <a>{'Vijay'}</a> </h1>
                  </Link> 
                }
              />

              {title}
        </div>
    )
}

export default  Truck