const PendingPaymentsData = [
  {
    pendingPayments: 'Over Due',
    advance: 206767,
    invoicePending: 145678,
    invoiced: 234567
  },
  {
    pendingPayments: 'Due',
    advance: 2067677,
    invoicePending: 145678,
    invoiced: 234567
  }
]

const totalPending = [
  { pendingType: 'Advance Pending', value: 14 },
  { pendingType: 'Invoice Pending', value: 205600 },
  { pendingType: 'Invoiced', value: 78000 }

]

const paymentBlock = {
  paymentBlock: true,
  pending: [
    { pendingType: 'Advance Pending (>5 D)', value: 8 },
    { pendingType: 'Invoiced (>30 D)', value: 78000 },
    { pendingType: 'Receipts (<30 D)', value: 104700 }
  ]
}
export { PendingPaymentsData, totalPending, paymentBlock }
