import { PageHeader } from 'antd'

const DetailPageHeader = (props) => {
  const { back, extra, title, subTitle, tags } = props
  return (
    <PageHeader
      className='p0'
      onBack={back ? () => window.history.back() : null}
      title={title}
      subTitle={subTitle}
      extra={extra || []}
      tags={tags || ''}
    />
  )
}

export default DetailPageHeader
