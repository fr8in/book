import { Modal} from 'antd'
import LabelWithData from '../../common/labelWithData'
import get from 'lodash/get'
import { gql, useQuery } from '@apollo/client'

const TRANSACTION_STATUS = gql`
  query transaction_status($doc_num:Float) {
    transaction_status(doc_num:$doc_num) {
      message
      response
      status
    }
  }`

const PayablesStatus = (props) => {
  const { visible,onHide,doc_num } = props

  const { loading, error, data } = useQuery(
    TRANSACTION_STATUS, {
      variables: { doc_num } ,
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )
  console.log('transaction_status error', error)

  var _data = []
  if (!loading) {
    _data = data
  }

  const transaction_status = get(_data, 'transaction_status', [])

  return (
    <>
      <Modal
        title='Transaction Status'
        visible={visible}
        onCancel={onHide}
        footer={[]}
      >
         <LabelWithData
        label='Status'
        data={
          transaction_status.status
        }
        mdSpan={4}
        smSpan={8}
        xsSpan={12}
      />
      <LabelWithData
        label='Response'
        data={transaction_status.response}
        mdSpan={4}
        smSpan={8}
        xsSpan={12}
      />
      <LabelWithData
        label='Description'
        data={transaction_status.message}
        mdSpan={4}
        smSpan={8}
        xsSpan={12}
      />
      </Modal>
    </>
  )
}

export default PayablesStatus
