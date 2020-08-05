import PageLayout from '../../components/layout/pageLayout'
import DashboardContainer from '../../components/dashboard/container/dashboardContainer'

const Dashboard = (props) => {
console.log(props)
  return (
    <PageLayout title='Dashboard'>
      <DashboardContainer />
    </PageLayout>
  )
}

export default Dashboard
