const PendingPaymentsData = [
  {
    id: 1,
    pendingPayments: 'Over Due',
    advance: 206767,
    invoicePending: 145678,
    invoiced: 234567
  },
  {
    id: 2,
    pendingPayments: 'Due',
    advance: 2067677,
    invoicePending: 145678,
    invoiced: 234567
  }
]

const totalPending = [
  { id: 1, pendingType: 'Advance Pending', value: 14 },
  { id: 2, pendingType: 'Invoice Pending', value: 205600 },
  { id: 3, pendingType: 'Invoiced', value: 78000 }

]

const paymentBlock = {
  paymentBlock: true,
  pending: [
    { id: 1, pendingType: 'Advance Pending (>5 D)', value: 8 },
    { id: 2, pendingType: 'Invoiced (>30 D)', value: 78000 },
    { id: 3, pendingType: 'Receipts (<30 D)', value: 104700 }
  ]
}
export { PendingPaymentsData, totalPending, paymentBlock }
