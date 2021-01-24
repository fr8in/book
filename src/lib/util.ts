const util = {
  limit: 100,
  getWeekNumber: (d) => {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
    // Get first day of year
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil((((d - Number(yearStart)) / 86400000) + 1) / 7)
    return { year: d.getUTCFullYear(), week: weekNo }
  },
  getLastSixMonth: () => {
    const today = new Date()
    const period = []

    for (var i = 0; i < 6; i++) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1)
      period.push({ month: d.getMonth() + 1, year: d.getFullYear() })
    }
    return period
  },
  getPervious4thDate: () => {
    const ourdate = new Date()
    const pastDate = ourdate.getDate() - 4;
    ourdate.setDate(pastDate)
    return ourdate
  },
  getfuture3rdDate: () => {
    const ourdate = new Date()
    const futureDate = ourdate.getDate() + 3;
    ourdate.setDate(futureDate)
    return ourdate
  },
  role: {
    admin: 'Admin',
    rm: 'RM',
    accounts_manager: 'Accounts Manager',
    billing_manager: 'Billing Manager',
    partner_manager: 'Partner Manager',
    partner_support: 'Partner Support',
    accounts: 'Accounts',
    onboarding: 'Onboarding',
    billing: 'Billing',
    bm: 'BM',
    hr: 'HR',
    user: 'user',
    sourcing: 'Sourcing',
    operations: 'Operations'
  },
  topic: {
    partner_name: 'Partner Name',
    partner_kyc_reject: 'Kyc Rejected',
    onboarded_by: 'Partner OnBoardedBy',
    address: 'Address',
    cibil_score: 'Cibil Score',
    gst: 'GST',
    pan: 'PAN',
    final_payment: 'Partner Final Payment',
    partner_advance_percentage: 'Advance Percentage',
    truck_no: 'Truck Number',
    truck_type: 'Truck Type',
    truck_dimension: 'Truck Dimension',
    truck_driver_number: 'Driver Number',
    truck_deactivation: 'Truck Deactivated',
    truck_activation: 'Truck activated',
    partner_deactivation: 'Partner Deactivated',
    partner_activation: 'Partner activated',
    partner_wallet_block: 'Partner Wallet Blocked',
    partner_wallet_unblock: 'Partner Wallet Unblocked',
    partner_blacklist: 'Partner Blacklisted',
    partner_unblacklist: 'Partner Unblacklisted',
    partner_bank_detail: 'Bank Detail',
    customer_type: 'Customer Type',
    customer_payment_manager: 'Customer Payment Manager',
    customer_exception: 'Customer Exception Date',
    customer_gst: 'Customer Gst',
    customer_onboardedby: 'Customer OnboardedBy',
    managed_customer: 'Managed Customer',
    customer_blacklist: 'Customer Blacklisted',
    customer_unblacklist: 'Customer Unblacklisted',
    customer_branch: 'Customer Branch',
    customer_user: 'Customer User',
    customer_fr8_employee: 'Fr8 Employee',
    customer_reject: 'Customer Reject',
    customer_advance_percentage: 'Customer Advance Percentage',
    billing_comment: 'Billing Comment',
    truck_owner_registration: 'Truck Owner Registration',
    trip_price_change: 'Trip Price Changed'
  },
  maxLength: 6,
  MIN_REBATE_PERCENTAGE: 0.25,
  MAX_INSURANCE_CASHBACK: 10000,
  handleLengthCheck: (e) => {
    if (e.target.value.length > e.target.maxLength) {
      e.target.value = e.target.value.slice(0, e.target.maxLength)
    }
  },
  membership_color: (membership) => {
    return (
      (membership === 1 || !membership) ? '#C0C0C0' : membership === 2 ? '#FFD700' : '#97b9ff'
    )
  },
  membership: (membership) => {
    return (
      (membership === 1 || !membership) ? 'Silver' : membership === 2 ? 'Gold' : 'Platinum'
    )
  },
  fileType: {
    pod: 'POD',
    lr: 'LR',
    evidence: 'EVIDENCELIST',
    wh: 'WH',
    customer_pan: 'PAN',
    partner_pan: 'PC',
    emi: 'EMI',
    rc: 'RC',
    vaahan: 'vaahan',
    insurance: 'insurance',
    permit: 'permit',
    check_leaf: 'CL',
    tds: 'TDS',
    agreement: 'AGREEMENT',
    cibil: 'CIBIL'
  },
  folder: {
    pod_lr: 'pod/',
    customer_lr: 'lr/',
    approvals: 'approvals/',
    wh: 'warehousereceipt/',
    customer_pan: 'pan/'
  },
  application_error: {
    JWT_TOKEN_EXPIRE_ERROR: 'Could not verify JWT: JWTExpired'
  },
  is_roles: (allowed_roles, context) => {
    const result = context.roles.some(role => allowed_roles.includes(role))
    return result
  },
  convertToLakhs: (value) => {
    const lakh_value = value ? (value / 100000).toFixed(2) : 0
    return lakh_value
  },

  shrinkText: (text, length) => {
    return text && text.length > length ? text.slice(0, length) + '...' : text
  },

  convertToNumber: (value) => {
    const number = value ? value * 100000 : 0
    return number
  },
  floatcheck: (value) => {
    return (value % 1 !== 0);
  },
  isNumber: (value) => {
    const reg = /^-?\d*(\.\d*)?$/;//this regex allows only number
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      return true
    }
    return false
  },
  calculatePercentage: (value, totalValue) => parseFloat(((value * 100) / totalValue).toFixed(2)),
  calculateAmountByPercentage: (percentage, totalValue) => parseFloat(((percentage * totalValue) / 100).toFixed(2)),
  groupByMultipleProperty: (array, f) => {
    var groups= {};
    array.forEach(function (o) {
      var group = JSON.stringify(f(o));
      groups[group] = groups[group] || [];
      groups[group].push(o);
    });
    return Object.keys(groups).map(function (group) {
      return groups[group];
    })
  }
}

export default util