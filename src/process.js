const input_data = require('./input.jsx')
const _ = require('lodash')
const {get} = require('lodash')

const { database } = require('firebase')
//1-- loop through branch map
//2-- get all trucks under one branch using flatmap
//3-- group by truck type 
//4-- format to output
//1 start 
// 1 end
//2 get all trucks under one branch using flatmap
const flatMapTruck = (branch_data) => {  
  const trucks = _.chain(branch_data).flatMap('connected_cities').flatMap('cities').flatMap('trucks').value()
 return trucks
}

const groupByTruckType = (trucks) => {
const trucksGroupedByTruckType = _.groupBy(trucks,'truck_type.code')
return trucksGroupedByTruckType
}

const formatMessage=(truck,i) =>
{
    const _formattedMessage =  `${i++}) Partner: ${get(truck, 'partner.name')}
    Truck No: ${truck.truck_no} - ${get(truck, 'tat')} hrs
    O: ${get(truck, 'partner.partner_users[0].mobile','-')} / D: ${get(truck, 'trips[0].driver.mobile','-')}
    Comment: ${get(truck, 'last_comment.description','-')}
    
    `
    return _formattedMessage
  }

const getMessage = (groupedTrucks) => {
    // let   message = `FR8 Trucks available at ${branch_name} \n \n`;
   
    const truck_types = Object.keys(groupedTrucks)
    
    let message = truck_types.map(truck_type=> {
    `${message} 

    ${truck_type}:
    ${groupedTrucks[truck_type].map(formatMessage)}
    `}) 
    return message
      
}

const trucks= flatMapTruck(input_data[0].region[0].branches)
const groupedTrucks = groupByTruckType(trucks)
const message = getMessage(groupedTrucks)
console.log('prop', message)


   
