import { useRouter } from 'next/router'

const PartnerDetail = () => {
  const router = useRouter()
  const {slug} = router.query || []

  return <h1>Slug: {slug.join('/')}</h1>
}

export default PartnerDetail
