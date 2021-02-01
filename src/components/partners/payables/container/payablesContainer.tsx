import ICICIBankOutgoing from '../iciciBankOutgoing'
import React, { useContext, useState, useEffect } from 'react'
import { Button, Card, DatePicker, message, Space, Tabs, Input } from 'antd'
import { DownloadOutlined, SearchOutlined } from '@ant-design/icons'
import { gql, useMutation, useSubscription, useQuery } from '@apollo/client'
import moment from 'moment'
import isEmpty from 'lodash/isEmpty'
import RelianceCashBack from '../reliancecashback/RelianceCashBack'
import u from '../../../../lib/util'
import CashBack from '../cashBack'
import CashBackButton from '../cashBackButton'
import userContext from '../../../../lib/userContaxt'
import Last7daysPending from '../last7daysPending'
import SourcingIncentive from '../sourcingIncentive/incentive'
import SourcingIncentiveModal from '../sourcingIncentive/modal'
import useShowHideWithRecord from '../../../../hooks/useShowHideWithRecord'
import _ from 'lodash'
import Customer_Incoming from './customerIncoming'
import sumBy from 'lodash/sumBy';
import get from 'lodash/get'
import now from 'lodash/now'


const { RangePicker } = DatePicker

const DATE_SELECT_MUTATION = gql`
mutation icici_statement($start_date:String!,$end_date:String!) {
  icici_statement(start_date:$start_date,end_date:$end_date)
}`

const SYNC_SOURCING_INCENTIVE_DATA = gql`mutation sync_sourcing_incentive($year: Int!, $month: Int!) {
  sync_sourcing_incentive(month: $month, year: $year) {
    status
    description
  }
}`

const CASH_BACK_QUERY = gql`subscription partner_membership($year: Int, $month: Int) {
  partner(where: {partner_membership_targets: {year: {_eq: $year}, month: {_eq: $month}, cash_back_applicable: {_eq: true}}, partner_status: {name: {_neq: "Blacklisted"}}}) {
    id
    cardcode
    name
    partner_membership_targets(where: {month: {_eq: $month}, year: {_eq: $year}}) {
      id
      year
      month
      partner_code
      transaction_fee
      cash_back_amount
      cash_back_percent
      cash_back_status
    }
    partner_accounting {
      cleared
      onhold
      wallet_balance
    }
  }
}`
const CUSTOMER_INCOMING_PAYMENTS = gql`
query  bank_incoming${now()}($search:String,$bank:[String]){
    bank_incoming(search:$search,bank:$bank) {
      transno
      amount
      date
      details
      originno
      bank
    }
  }`

const TabPane = Tabs.TabPane
const PayablesContainer = () => {
  const [tabIndex, setTabIndex] = useState('0')
  const [month, setMonth] = useState(null)
  const [year, setYear] = useState(null)
  const [dates, setDates] = useState([])
  const [search, setSearch] = useState(null)
  const [totalSum, setTotalSum] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [bankFilter, setBankFilter] = useState([])

  const initial = { loading: false }
  const [disableBtn, setDisableBtn] = useState(initial)
  const [sourcingIncentiveData, setSourcingIncentiveData] = useState([])
  const [loading, setLoading] = useState(false)
  const context = useContext(userContext)
  const { role } = u

  const roles = [role.admin]
  const access = u.is_roles(roles, context)

  const fuelCashback_roles = [role.admin, role.accounts_manager, role.accounts]
  const fuelCashback_access = u.is_roles(fuelCashback_roles, context)

  const sourcing_incentive_roles = [role.admin, role.hr]
  const sourcing_incentive_access = u.is_roles(sourcing_incentive_roles, context)

  let today = new Date()
  let day = today.getDay()
  const { loading: bankLoading, data, error } = useQuery(
    CUSTOMER_INCOMING_PAYMENTS,
    {
      variables: { search: search || null, bank: bankFilter },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )
  let _data = {}
  if (!bankLoading) {
    _data = data
  }
  const bank_incoming = get(_data, 'bank_incoming', [])

  useEffect(() => {
    const totalCount = bank_incoming ? bank_incoming.length : 0
    const totalSum = bank_incoming ? sumBy(bank_incoming, 'amount').toFixed(2) : 0
    setTotalSum(totalSum)
    setTotalCount(totalCount)
  },
    [bankLoading]
  )

  const disabledDate = (current) => {
    if (!dates || dates.length === 0) {
      return false
    }
    const tooLate = dates[0] && current.diff(dates[0], 'days') > 30
    const tooEarly = dates[1] && dates[1].diff(current, 'days') > 30
    return ((tooEarly || tooLate))
  }

  const { data: cashBackData, loading: cashBackLoading, error: cashBackError } = useSubscription(CASH_BACK_QUERY, {
    skip: !year || !month,
    variables: {
      year: year,
      month: month
    }
  })

  const handleMonthChange = (date, dateString) => {
    const splittedDate = dateString.split('-')
    setYear(parseInt(splittedDate[0]))
    setMonth(parseInt(splittedDate[1]))
  }
  const onSearch = (e) => {
    setSearch(e.target.value)
  }
  const onBankFilter = (bank) => {
    setBankFilter(bank)
  }

  const handleIncentiveMonthChange = (date, dateString) => {
    const splittedDate = dateString.split('-')
    setYear(parseInt(splittedDate[0]))
    setMonth(parseInt(splittedDate[1]))
    setSourcingIncentiveData([])
    setLoading(true)
    sync_sourcing_incentive({
      variables: {
        year: parseInt(splittedDate[0]),
        month: parseInt(splittedDate[1])
      }
    })
  }



  function disabledMonthForFuelCashBack(current) {
    return current && current < moment("2020/11/01") || current > moment();
  }

  const [icici_statement] = useMutation(
    DATE_SELECT_MUTATION,
    {
      onError(error) {
        message.error(error.toString())
        setDisableBtn(disableBtn)
      },
      onCompleted(data) {
        setDisableBtn(initial)
        const url = data && data.icici_statement
        window.open(url, 'icici_statement')
        message.success('Download!!')
      }
    }
  )

  const [sync_sourcing_incentive] = useMutation(
    SYNC_SOURCING_INCENTIVE_DATA,
    {
      onError(error) {
        message.error(error.toString())
      },
      onCompleted(data) {
        setLoading(false)
        if (data.sync_sourcing_incentive.status !== "OK")
          message.error(data.sync_sourcing_incentive.description)
      }
    }
  )


  const handleCashBackDate = (date) => {
    return moment().diff(date, 'months') > 1 || moment().diff(date, 'months') < 1
  }

  const handleSourcingIncentiveDate = (date) => {
    const listDate = date.format("YYYYMM")
    const currentDate = moment().format("YYYYMM")
    return moment().subtract(1, 'months').diff(date, 'months') === 0 && listDate == currentDate
  }

  let membership_data = []
  if (!cashBackLoading) {
    membership_data = _.get(cashBackData, 'partner', [])
  }

  const transactionFeeSum = _.sumBy(membership_data, 'partner_membership_targets[0].transaction_fee')
  const cashBackSum = _.sumBy(membership_data, 'partner_membership_targets[0].cash_back_amount')
  const count = membership_data.length

  let saturday = 6;
  let friday = 5
  let sunday = 0;
  let monday = 1
  let current_date = [moment(today, "DD-MM-YYYY"), moment(today, "DD/MM/YYYY")]

  const _day = (day === saturday) ? [current_date[1].add(2, "days"), current_date[0].subtract(1, "days")]
    : (day === friday) ? [current_date[1].add(3, "days"), current_date[0]]
      : (day === sunday) ? [current_date[1].add(1, "days"), current_date[0].subtract(2, "days")]
        : (day === monday) ? [current_date[1].subtract(2, "days"), current_date[0]]
          : [current_date[1], current_date[0].subtract(2, "days")]

  const [date, setDate] = useState([_day[1], _day[0]])

  const onConfirm = () => {
    if (!isEmpty(dates)) {
      setDisableBtn({ ...disableBtn, loading: true })
      icici_statement({
        variables: {
          start_date: dates[0].format('DD-MM-YYYY'),
          end_date: dates[1].format('DD-MM-YYYY')
        }
      })
    } else {
      message.error('Select Start date and End date!')
    }
  }

  const handleSourcingIncentiveData = (data) => {
    setSourcingIncentiveData(data)
  }

  const { object, handleHide, handleShow } = useShowHideWithRecord(initial)


  const TabBarContent = () => {
    return (
      (tabIndex === '0') ?
        (
          <Space>
            <RangePicker
              size='small'
              format='DD-MM-YYYY'
              disabledDate={(current) => disabledDate(current)}
              onCalendarChange={(value) => {
                setDates(value)
              }}
            />
            <Button size='small' loading={disableBtn.loading} >
              <DownloadOutlined onClick={() => onConfirm()} />
            </Button>
          </Space>)
        : (tabIndex === '2')
          ? (
            <Space>
              {access &&
                <Space>
                  <p className='pt10'><b>Partner Count:</b> {count}</p>
                  <p className='pt10'><b>Total Transaction Fee:</b> {transactionFeeSum}</p>
                  <p className='pt10'><b>Total Cashback:</b> {cashBackSum}</p>
                  <DatePicker
                    disabledDate={(date) => handleCashBackDate(date)}
                    onChange={handleMonthChange} picker='month'
                  />
                  <CashBackButton
                    month={month}
                    year={year}
                  />
                </Space>}
            </Space>
          )
          : (tabIndex === '3') ?
            <DatePicker onChange={handleMonthChange} picker='month'
              disabledDate={(current) => disabledMonthForFuelCashBack(current)} />
            : (tabIndex === '4') ? <Space>
              {sourcing_incentive_access && <> <Button type="primary" disabled={!(sourcingIncentiveData.length > 0)}
                onClick={() => handleShow('incentiveVisible', "Process Incentive", 'incentiveData', sourcingIncentiveData)}>Process</Button>
                <DatePicker
                  disabledDate={(date) => !handleSourcingIncentiveDate(date)}
                  onChange={handleIncentiveMonthChange} picker='month' /></>} </Space>

              : (tabIndex === '5') ? <Space>
                <span className='text-right'>Total Count: <b>{totalCount}</b></span>
                <span className='text-right'>Total Amount: <b>₹{totalSum}</b></span>
                <Input placeholder='Search...' suffix={<SearchOutlined />} onChange={onSearch} />
              </Space>
                : null
    )
  }

  return (
    <Card size='small' className='card-body-0 border-top-blue'>
      <Tabs
        tabBarExtraContent={TabBarContent()}
        defaultActiveKey={tabIndex}
        onChange={(e) => setTabIndex(e)}
      >
        <TabPane tab='ICICI Bank Outgoing' key='0'>
          <ICICIBankOutgoing />
        </TabPane>
        <TabPane tab='Statement' key='1'>
          <Last7daysPending />
        </TabPane>
        {access &&
          <TabPane tab='Transaction Fee' key='2'>
            <CashBack
              month={month}
              year={year}
              membership_data={membership_data}
              loading={cashBackLoading}
            />
          </TabPane>}
        {fuelCashback_access &&
          <TabPane tab='Reliance' key='3'>
            <RelianceCashBack month={month} year={year} />
          </TabPane>}
        <TabPane tab="Sourcing Incentive" key="4">
          <SourcingIncentive year={year} loading={loading}
            month={month} onChange={handleSourcingIncentiveData} />
        </TabPane>
        <TabPane tab="Customer Incoming" key="5">
          <Customer_Incoming onBankFilter={onBankFilter} bank_incoming={bank_incoming} bankLoading={bankLoading} />
        </TabPane>
        {object.incentiveVisible && <SourcingIncentiveModal
          visible={object.incentiveVisible}
          onCancel={handleHide}
          data={object.incentiveData}
          title={object.titile}
          onChange={handleSourcingIncentiveData}
        />}
      </Tabs>
    </Card>
  )
}

export default PayablesContainer
