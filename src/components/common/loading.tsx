import { Spin } from 'antd'

const Loading = (props) => {
  const { preloading, fixed } = props
  return (
    <div className={`${preloading ? 'preloading' : ''} ${fixed && 'fixed'} hv-center`}>
      <div className='text-center'>
        {preloading &&
          <div>
            <h1>FR<span>8</span></h1>
            <p>India’s Largest Truck Brokerage Network</p>
          </div>}
        <Spin />
      </div>
    </div>
  )
}

export default Loading
