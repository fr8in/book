import PageLayout from '../../components/layout/pageLayout'
import BranchesContainer from '../../components/branches/container/branchesContainer'

const Branches = (props) => {
  return (
    <PageLayout {...props} title='Branches'>
      <BranchesContainer />
    </PageLayout>
  )
}

export default Branches
