
import Head from 'next/head'

const PageLayout = (props) => {
  return (
    <>
      <Head>
        <title>{props.title ? 'FR8 - ' + props.title : 'FR8 - Track'}</title>
        <link rel='icon' href='/favicon.ico' type='image/x-icon' />
        <meta charSet='utf-8' />
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <div className='pageBox'>
        {props.children}
      </div>
    </>
  )
}

export default PageLayout
