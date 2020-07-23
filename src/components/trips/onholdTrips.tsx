import { Modal, Table,} from 'antd'
import onholdData from '../../../mock/trip/onholdTrips'
 
const onholdTrips = (props) => {
    const { visible, onHide } = props

    const statusList = [
        { value: 1, text: "Opened" },
        { value: 11, text: "Closed" }
        ];

    const columns = [
        {
          title: 'LoadId',
          dataIndex: 'id',
          sorter: (a, b) => (a.id > b.id ? 1 : -1),
          width: '6%'
        },
        {
          title: 'Source',
          dataIndex: 'source',
          width: '8%'
        },
        {
          title: 'Destination',
          dataIndex: 'destination',
          width: '8%'
        },
        {
          title: 'Truck',
          dataIndex: 'truckNo',
          sorter: (a, b) => (a.truckNo > b.truckNo ? 1 : -1),
          width: '8%'
        },
        {
          title: 'Type',
          dataIndex: 'type',
          width: '6%'
        },
        {
          title: 'Partner',
          dataIndex: 'partner',
          sorter: (a, b) => (a.partner > b.partner ? 1 : -1),
          width: '8%'
        },
        {
          title: 'Customer',
          dataIndex: 'customer',
          sorter: (a, b) => (a.customer > b.customer ? 1 : -1),
          width: '12%'
        },
        {
            title: 'Price',
            dataIndex: 'price',
            sorter: (a, b) => (a.price > b.price ? 1 : -1),
            width: '6%'
          },
          {
            title: 'On-hold',
            dataIndex: 'onhold',
            sorter: (a, b) => (a.onhold > b.onhold ? 1 : -1),
            width: '10%'
          },
          {
            title: 'S/D',
            dataIndex: 'sd',
            sorter: (a, b) => (a.sd > b.sd ? 1 : -1),
            width: '6%'
          },
          {
            title: 'Released',
            dataIndex: 'released',
            sorter: (a, b) => (a.released > b.released ? 1 : -1),
            width: '6%'
          },
        {
          title: 'Aging',
          dataIndex: 'aging',
          sorter: (a, b) => (a.aging > b.aging ? 1 : -1),
          width: '6%'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            filters: statusList,
            width: '12%'
          }
      ]
    

    return (
        <Modal
            title='On-Hold Trips'
            visible={visible}
            onCancel={onHide}
            width={1200}
        >
            <Table
                columns={columns}
                dataSource={onholdData}
                rowKey={(record) => record.id}
                size='small'
                scroll={{ x: 780, y: 400 }}
                pagination={false}
            />
        </Modal>
    )

}
export default onholdTrips