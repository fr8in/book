import PageLayout from '../../../layout/pageLayout'
import CardsContainer from '../containter/cardsContainer'

const Cards = (props) => {
  return (
    <PageLayout {...props} title='Cards'>
      <CardsContainer />
    </PageLayout>
  )
}
export default Cards
