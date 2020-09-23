import DashboardMain from './dashboard'
// import { useEffect, useState } from 'react'
// import Router from 'next/router'

const Dashboard = (props) => {
  // const [loggedIn, setLoggedIn] = useState(false)

  // useEffect(() => {
  //   if (loggedIn) return
  //   Router.replace('/private', '/login', { shallow: true })
  // }, [loggedIn])

  return (
    <DashboardMain {...props} />
  )
}
export default Dashboard
