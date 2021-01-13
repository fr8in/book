import Head from 'next/head'
import '../../styles/login.less'


const LeadLayout = (props) => {
 
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

export default LeadLayout
