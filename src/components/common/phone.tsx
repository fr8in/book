import { PhoneOutlined } from '@ant-design/icons'

const Phone = (props) => {
    const {number,text,icon} = props
    const callNow = data => window.location.href = 'tel:' + data
    
    return (
        <span className='link' onClick={() => callNow(number)}>
         { icon ?<PhoneOutlined /> : (text ? text : number)}
        </span>
    )
}
export default Phone