import { useRouter } from 'next/router'

const CustomerDetail = () => {
  const router = useRouter()
  const { slug } = router.query

  return <p>Post: {slug}</p>
}

export default CustomerDetail