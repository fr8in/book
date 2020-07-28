import moment from 'moment'

const CustomerExceptionDate = (props) => {
  const { exceptionDate, cardcode } = props
  return (
    <div>
      <label>
        {exceptionDate ? moment(exceptionDate).format('DD-MM-YYYY') : '-'}
      </label>
    </div>
  )
}

export default CustomerExceptionDate
