
import { gql, useQuery, useMutation, useSubscription} from '@apollo/client'
import { Modal , Form ,Button } from 'antd'


const GET_TOKEN = gql`
query getToken($ref_id: Int!, $process: String!) {
    token(ref_id: $ref_id, process: $process)
  }
`




const IciciIncomingTransfer = (visible,onHide) => {

  const [form] = Form.useForm()

  console.log("in incoming component")

  let ref_id = 3434

    const { data } = useQuery(GET_TOKEN, {
        fetchPolicy: 'network-only',
        variables: {
          ref_id: ref_id,
          process: 'INCOMING_OUTGOING_TRANSFER'
        }
      })

      console.log("data  ",data)

  return (<>
  <Modal
      title='Transfer To Outgoing Account'
      visible={visible}
      onCancel={onHide}
      footer={[]}
    >

<Form layout='vertical'  form = {form}  >
<Form.Item label = 'Enter the amount' name = 'amount' initialValue = {0}  >
  <input type="number"/>
  </Form.Item>
  <Form.Item >
  <Button
                type='primary'
                htmlType='submit'
              >
                Send Email
              </Button>
  </Form.Item>
</Form>
      </Modal>
      
      </>)
}

export default IciciIncomingTransfer
