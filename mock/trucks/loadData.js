const loadData = [
  {
    id: 1,
    truckNo: 'HR38S9210 - 32 Ft S',
    partnerId: '100',
    partner: 'Sivasakthian',
    partnerMembershipId: 0,
    partnerNo: '9594210250',
    users: [
      { id: 1, mobileNo: '9594210250' },
      { id: 2, mobileNo: '9594210251' }
    ],
    noOfLoadsTaken: 20,
    partnerEngagementPercent: 60,
    driverPhoneNo: '9594210250',
    statusId: 7,
    city: 'Chennai',
    tat: 6.24,
    previousComment: [
      { id: 11, message: 'Available for Load', userName: 'raju@fr8.in', date: '2020-06-15 02:12' },
      { id: 12, message: 'Available for Load', userName: 'babu@fr8.in', date: '2020-06-15 02:12' }
    ],
    comment: 'available in chennai'
  },
  {
    id: 2,
    truckNo: 'HR38S9220 - 32 Ft M',
    partnerId: 101,
    partner: 'Irshad Akhtar khan',
    partnerNo: '9594210257',
    users: [
      { id: 1, mobileNo: '9594210257' },
      { id: 2, mobileNo: '9594210250' }
    ],
    partnerMembershipId: 1,
    noOfLoadsTaken: 20,
    partnerEngagementPercent: 60,
    driverPhoneNo: '9594210256',
    statusId: 6,
    city: 'Chennai',
    tat: 6.24,
    previousComment: [
      { id: 11, message: 'Available for Load', userName: 'raju@fr8.in', date: '2020-06-15 02:12' },
      { id: 12, message: 'Available for Load', userName: 'babu@fr8.in', date: '2020-06-15 02:12' }
    ],
    comment: 'available in chennai'
  },
  {
    id: 3,
    truckNo: 'HR38S9202 - 32 Ft M',
    partnerId: 102,
    partner: 'Ram Ratan',
    partnerMembershipId: 0,
    partnerNo: '9594210257',
    users: [
      { id: 1, mobileNo: '9594210257' },
      { id: 2, mobileNo: '9594210250' }
    ],
    noOfLoadsTaken: 20,
    partnerEngagementPercent: 60,
    driverPhoneNo: '9594210256',
    statusId: 6,
    city: 'Chennai',
    tat: 6.24,
    previousComment: [
      { id: 11, message: 'Available for Load', userName: 'raju@fr8.in', date: '2020-06-15 02:12' },
      { id: 12, message: 'Available for Load', userName: 'babu@fr8.in', date: '2020-06-15 02:12' }
    ],
    comment: 'available in chennai'
  },
  {
    id: 4,
    truckNo: 'HR38S9103 - 32 Ft M',
    partnerId: 103,
    partner: 'Irshad Akhtar khan',
    partnerMembershipId: 1,
    partnerNo: '9594210257',
    users: [
      { id: 1, mobileNo: '9594210257' },
      { id: 2, mobileNo: '9594210250' }
    ],
    noOfLoadsTaken: 20,
    partnerEngagementPercent: 60,
    driverPhoneNo: '9594210256',
    statusId: 7,
    city: 'Chennai',
    tat: 6.24,
    previousComment: [
      { id: 11, message: 'Available for Load', userName: 'raju@fr8.in', date: '2020-06-15 02:12' },
      { id: 12, message: 'Available for Load', userName: 'babu@fr8.in', date: '2020-06-15 02:12' }
    ],
    comment: 'available in chennai'
  },
  {
    id: 5,
    truckNo: 'HR38S9208 - 32 Ft M',
    partnerId: 104,
    partner: 'Irshad Akhtar khan',
    partnerMembershipId: 0,
    partnerNo: '9594210257',
    users: [
      { id: 1, mobileNo: '9594210257' },
      { id: 2, mobileNo: '9594210250' }
    ],
    noOfLoadsTaken: 20,
    partnerEngagementPercent: 60,
    driverPhoneNo: '9594210256',
    statusId: 6,
    city: 'Chennai',
    tat: 6.24,
    previousComment: [
      { id: 11, message: 'Available for Load', userName: 'raju@fr8.in', date: '2020-06-15 02:12' },
      { id: 12, message: 'Available for Load', userName: 'babu@fr8.in', date: '2020-06-15 02:12' }
    ],
    comment: 'available in chennai'
  },
  {
    id: 6,
    truckNo: 'HR38S9206 - 32 Ft M',
    partnerId: 105,
    partner: 'Irshad Akhtar khan',
    partnerMembershipId: 0,
    partnerNo: '9594210257',
    users: [
      { id: 1, mobileNo: '9594210257' },
      { id: 2, mobileNo: '9594210250' }
    ],
    noOfLoadsTaken: 20,
    partnerEngagementPercent: 60,
    driverPhoneNo: '9594210256',
    statusId: 6,
    city: 'Chennai',
    tat: 6.24,
    previousComment: [
      { id: 11, message: 'Available for Load', userName: 'raju@fr8.in', date: '2020-06-15 02:12' },
      { id: 12, message: 'Available for Load', userName: 'babu@fr8.in', date: '2020-06-15 02:12' }
    ],
    comment: 'available in chennai'
  },
  {
    id: 7,
    truckNo: 'HR38S9235 - 32 Ft M',
    partnerId: 106,
    partner: 'Irshad Akhtar khan',
    partnerMembershipId: 0,
    partnerNo: '9594210257',
    users: [
      { id: 1, mobileNo: '9594210257' },
      { id: 2, mobileNo: '9594210250' }
    ],
    noOfLoadsTaken: 20,
    partnerEngagementPercent: 60,
    driverPhoneNo: '9594210256',
    statusId: 6,
    city: 'Chennai',
    tat: 6.24,
    previousComment: [
      { id: 11, message: 'Available for Load', userName: 'raju@fr8.in', date: '2020-06-15 02:12' },
      { id: 12, message: 'Available for Load', userName: 'raju@fr8.in', date: '2020-06-15 02:12' }
    ],
    comment: 'available in chennai'
  },
  {
    id: 8,
    truckNo: 'HR38S9232 - 32 Ft M',
    partnerId: 107,
    partner: 'Irshad Akhtar khan',
    partnerMembershipId: 0,
    partnerNo: '9594210257',
    users: [
      { id: 1, mobileNo: '9594210257' },
      { id: 2, mobileNo: '9594210250' }
    ],
    noOfLoadsTaken: 20,
    partnerEngagementPercent: 60,
    driverPhoneNo: '9594210256',
    statusId: 6,
    city: 'Chennai',
    tat: 6.24,
    previousComment: [
      { id: 11, message: 'Available for Load', userName: 'raju@fr8.in', date: '2020-06-15 02:12' },
      { id: 12, message: 'Available for Load', userName: 'babu@fr8.in', date: '2020-06-15 02:12' }
    ],
    comment: 'available in chennai'
  }
]

export default loadData
