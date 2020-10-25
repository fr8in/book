export default {
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
    user: 'user'
  },
  maxLength: 6,
  MIN_REBATE_PERCENTAGE: 0.25,
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
  }
  isEmptyArray:(arrray,default)=>
}
