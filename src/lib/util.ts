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
    admin: 'admin',
    rm: 'rm',
    accounts_manager: 'accounts_manager',
    billing_manager: 'billing_manager',
    partner_manager: 'partner_manager',
    partner_support: 'partner_support',
    accounts: 'accounts',
    onboarding: 'onboarding',
    billing: 'billing',
    user: 'user'
  },
  maxLength: 6,
  MIN_REBATE_PERCENTAGE: 0.25,
  handleLengthCheck: (e) => {
    if (e.target.value.length > e.target.maxLength) {
      e.target.value = e.target.value.slice(0, e.target.maxLength)
    }
  }
}
