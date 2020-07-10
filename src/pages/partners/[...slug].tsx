import { useRouter } from 'next/router'

const PartnerDetail = () => {
  const router = useRouter()
  const { slug } = router.query

  return <p>Post: {slug}</p>
}

export default PartnerDetail