
import PageLayout from '../../components/layout/pageLayout'

const Reports = (props) => {
  return (
    <PageLayout {...props} title='Reports'>
    
      <div className='reports'>
            <iframe
              width='100%'
              height='100%'
              src='https://app.powerbi.com/view?r=eyJrIjoiOTc0ZmJkMmItMzRiOS00OTljLTg4ZGEtZjc4NTE2OWE2ZDJiIiwidCI6IjE5ZWE5NTViLTE1MzYtNGM3Ni04NDIwLTUxZmJjNGM5YzM5NyIsImMiOjEwfQ=='
            />
        </div>
    </PageLayout>
  )
}

export default Reports
