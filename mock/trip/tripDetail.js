const tripDetail = {
  trip: {
    tripId: 187550,
    source: 'Bangalore',
    Destination: 'Hyderabad',
    status: 'Invoiced',
    statusId: 13,
    orderDate: 1595080099778,
    poDate: 1595080099778,
    ETA: 1595080999778,
    delay: 0,
    ap: null,
    ar: null,
    lr: {
      lrNumber: null,
      lrUrl: null,
      confirmed: false
    },
    loadingMemo: {
      wordDocUrl: 'url/of/memo.docx',
      pdfUrl: 'url/of/memo.pdf'
    },
    remarks: {
      evidence: 'evidence/file.jpg',
      comment: 'Test comment'
    },
    pod: {
      podDoc: ['pod/file/url1.jpg', 'pod/file/url2.jpg']
    },
    additionalAdvacne: [{
      type: 'wallet',
      amount: 875,
      reason: 'Additional Advance requested by Partner - 8489377288',
      status: 'Completed'
    }],
    payables: {
      total: 24500,
      charges: [
        { name: 'tripRate', amount: 23500 },
        { name: 'commission', amount: -750 },
        { name: 'loading', amount: 750 },
        { name: 'on-Hold', amount: 1000 }
      ]
    },
    payments: {
      total: 24500,
      paid: [
        { mode: 'wallet', date: 1595080099778, remark: 'IMPS-019623896035', amount: 18500 },
        { mode: 'wallet', date: 1595080099778, remark: 'IMPS-019623896037', amount: 3500 },
        { mode: 'wallet', date: 1595080099778, remark: 'IMPS-019623896039', amount: 1500 }
      ]
    },
    receivables: {
      total: 24500,
      charges: [
        { name: 'Freight', amount: 23500 }
      ]
    },
    receipts: {
      total: 24500,
      paid: [
        { mode: 'wallet', date: 1595080099778, remark: 'IMPS-019623896035', amount: 19350 },
        { mode: 'payment Gateway', date: 1595080099778, remark: 'IMPS-019623896037', amount: 4150 }
      ]
    },
    timeStamp: {
      sourceIn: 1595080099778,
      sourceOut: null,
      destinationIn: null,
      destinationOut: null
    }
  },
  customer: {
    cardcode: 'RT001587',
    name: 'Kalaimagal Transport',
    userName: 'Ravikumar',
    contactNo: '9988776655',
    gstNo: null,
    hsnNo: null,
    branch: {
      doorNo: 83,
      address: 'VAZHAKARUTHEESWARAR KOIL, STREET KANCHIPURAM',
      city: 'KANCHIPURAM',
      pinCode: 631501,
      state: 'Tamilnadu'
    }
  },
  partner: {
    cardcode: 'ST004837',
    name: 'Ashok Kumar S'
  },
  device: {
    truckNo: 'TN28BE4237',
    truckType: '32Ft MXL',
    driverNo: 9443392587,
    deviceId: 320768
  },
  priceDetail: {
    customerPrice: 23500,
    partnerPrice: 23000,
    cash: 0,
    toPay: 0,
    mamul: 500,
    includingLoading: 'Yes',
    includingUnloading: 'No'
  }
}

export default tripDetail
