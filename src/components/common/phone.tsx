import { PhoneOutlined } from '@ant-design/icons'

const Phone = (props) => {
    const {number,text} = props
    const callNow = data => window.location.href = 'tel:' + data
    
    return (
        <span className='link' onClick={() => callNow(number)}>
            {text ? text : number}
        </span>
    )
}
export default Phone