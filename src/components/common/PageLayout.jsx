
import Head from 'next/head'

const PageLayout = (props) => {
  return (
    <>
      <Head>
        <title>{props.title ? 'FR8 - ' + props.title : 'FR8 - Track'}</title>
      </Head>
      <div className='pageBox'>
        {props.children}
      </div>
    </>
  )
}

export default PageLayout
