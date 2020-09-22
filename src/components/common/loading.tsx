import { Spin } from 'antd'

const Loading = (props) => {
  const { main } = props
  return (
    <div className={`${main && 'main'} hv-center`}>
      <div className='text-center'>
        {main &&
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
