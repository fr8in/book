import { useRouter } from 'next/router'
import PageLayout from '../../../components/layout/PageLayout'

const PartnerDetail = () => {
  const router = useRouter()
  const {slug} = router.query || []

  return (
    <PageLayout title={`Partner - ${slug[1]}`}>
      <h1>Slug: {slug.join('/')}</h1>
    </PageLayout>
  )
}

export default PartnerDetail
