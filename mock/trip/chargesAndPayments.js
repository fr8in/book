const data = {
  loadVendorCharge: [
    {
      amount: 23500,
      name: 'Trip Rate',
      orderId: 1
    },
    {
      amount: 0,
      name: 'On-Hold',
      orderId: 9
    },
    {
      amount: 2800,
      name: 'Shortage',
      orderId: 9
    },
    {
      amount: -750,
      name: 'Commission Fee',
      orderId: 4
    }
  ],
  loadVendorPayment: [
    {
      amount: 16450,
      date: 1594751400000,
      mode: 'Wallet'
    },
    {
      amount: 1600,
      date: 1594751400000,
      mode: 'Bank'
    }
  ],
  loadCustomerCharge: [
    {
      amount: 23500,
      loadId: 191383,
      name: 'Freight'
    }
  ],
  loadCustomerPayment: [
    {
      amount: 19350,
      date: 1594751400000,
      docType: 'I',
      mode: 'Payment Gateway',
      paymentComment: 'IMPS-019623896035-Unregistered-HDFC-xxxxxxxxx0052-'
    }
  ]
}

export default data
