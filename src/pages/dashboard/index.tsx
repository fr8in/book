import PageLayout from '../../components/layout/pageLayout'
import DashboardContainer from '../../components/dashboard/container/dashboardContainer'

const Dashboard = (props) => {
  return (
    <PageLayout {...props} title='Dashboard'>
      <DashboardContainer />
    </PageLayout>
  )
}

export default Dashboard
