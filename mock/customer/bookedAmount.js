const bookedAmount = [
  {
    id: 1,
    date: '2019-07-29',
    recevied: 16000,
    booked: 15550,
    balance: 450,
    remarks: 'CHQ DEP-MICR CLG-CHENNAI RK SALAI - MICR',
    docEntry: [
      {
        id: 1,
        date: '2019-07-30',
        loadId: 140886,
        invoiceNo: 901001,
        comments: 'Final Payment',
        amount: 3350
      }
    ]
  },
  {
    id: 2,
    date: '2020-04-15',
    recevied: 37500,
    booked: 36700,
    balance: 800,
    remarks: 'IMPS-010612372826-BALURGHAT TECHNOLOGI-HDFC-xxxxxx',
    docEntry: [
      {
        id: 1,
        date: '2019-07-30',
        loadId: 140886,
        invoiceNo: 901001,
        comments: 'Final Payment',
        amount: 3350
      }
    ]
  }
]

export default bookedAmount
