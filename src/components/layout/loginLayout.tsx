import Head from 'next/head'
import '../../styles/login.less'
import Router from 'next/router'
import Loading from '../common/loading'

const Auth = (props) => {
  if (props.authState.status === 'in') {
    Router.push('/')
    return <Loading preloading />
  } else if (props.authState.status !== 'out') {
    return <Loading preloading />
  }
  return (
    <>
      <Head>
        <title>{props.title ? 'FR8 - ' + props.title : 'FR8 - Track'}</title>
        <link rel='icon' href='https://www.fr8.in/images/favicon.ico' type='image/x-icon' />
        <meta charSet='utf-8' />
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <section className='aligner'>
        {props.children}
      </section>
    </>
  )
}

export default Auth
