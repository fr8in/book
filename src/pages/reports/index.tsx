
import PageLayout from '../../components/layout/pageLayout'

const Reports = (props) => {
  return (
    <PageLayout {...props} title='Reports'>
      <div className='reports'>
        <iframe
          width='100%'
          height='100%'
          src='https://app.powerbi.com/view?r=eyJrIjoiODVkM2IxYmItNWMxNi00OTI2LWI0MWMtOTI2NDllNjBhMjg0IiwidCI6Ijc2NzA4ZDI4LWNhNzYtNDBhNS05OWU4LWY5MzZlODZhN2MwYyIsImMiOjEwfQ=='
        />
      </div>
    </PageLayout>
  )
}

export default Reports
