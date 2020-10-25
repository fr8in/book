import { Table, Pagination, Radio, Input } from 'antd'
import { useState } from 'react'
import { EditTwoTone, SearchOutlined } from '@ant-design/icons'
import CreateBreakdown from '../../components/trucks/createBreakdown'
import PartnerUsers from '../partners/partnerUsers'
import CreatePo from '../../components/trips/createPo'
import useShowHidewithRecord from '../../hooks/useShowHideWithRecord'
import get from 'lodash/get'
import LinkComp from '../common/link'

const Trucks = (props) => {
  const initial = {
    usersData: [],
    usersVisible: false,
    truckId: [],
    poVisible: false,
    editVisible: false,
    editData: [],
    title: ''
  }
  const { object, handleHide, handleShow } = useShowHidewithRecord(initial)
  const [currentPage, setCurrentPage] = useState(1)

  const {
    trucks,
    loading,
    record_count,
    onPageChange,
    onNameSearch,
    onTruckNoSearch,
    filter,
    truck_status_list,
    onFilter
  } = props

  const pageChange = (page, pageSize) => {
    const newOffset = page * pageSize - filter.limit
    setCurrentPage(page)
    onPageChange(newOffset)
  }

  const handleStatus = (e) => {
    onFilter(e.target.value)
  }

  const handleName = (e) => {
    onNameSearch(e.target.value)
  }

  const handleTruckNo = (e) => {
    onTruckNoSearch(e.target.value)
  }

  const truck_status = truck_status_list.map((data) => {
    return { value: data.id, label: data.name }
  })

  const columns = [
    {
      title: 'Truck No',
      width: '20%',
      render: (text, record) => {
        return (
          <LinkComp
            type='trucks'
            data={`${record.truck_no} - ${get(record, 'truck_type.name', null)}`}
            id={record.truck_no}
          />
        )
      },
      filterDropdown: (
        <Input
          placeholder='Search TruckNo'
          value={filter.truck_no}
          onChange={handleTruckNo}
        />
      ),
      filterIcon: () => (
        <SearchOutlined
          style={{ color: filter.mobile ? '#1890ff' : undefined }}
        />
      )
    },
    {
      title: 'Trip ID',
      width: '8%',
      render: (text, record) => {
        const id = get(record, 'trips[0].id', null)
        return (
          <span>
            {id && <LinkComp type='trips' data={id} id={id} />}
          </span>
        )
      }
    },
    {
      title: 'Trip',
      width: '8%',
      render: (text, record) => {
        const id = get(record, 'trips[0].id', null)
        const source = get(record, 'trips[0].source.name', null)
        const destination = get(record, 'trips[0].destination.name', null)
        const status = get(record, 'truck_status.name', null)
        const partner_status = get(record, 'partner.partner_status.name', null)
        return (
          <span>
            {id ? (
              <span>{(source ? source.slice(0, 3) : null) + '-' + (destination ? destination.slice(0, 3) : null)}</span>
            ) : (status === 'Waiting for Load' && partner_status === 'Active') ? (
              <a
                className='link'
                onClick={() => handleShow('poVisible', record.partner.name, 'truckId', record.id)}
              >
                Assign
              </a>
            ) : (
              'NA'
            )}
          </span>
        )
      }
    },
    {
      title: 'Partner',
      width: '14%',
      render: (text, record) => {
        const cardcode = get(record, 'partner.cardcode', null)
        const name = get(record, 'partner.name', null)
        return (
          <LinkComp type='partners' data={name} id={cardcode} length={20} />
        )
      },

      filterDropdown: (
        <div>
          <Input
            placeholder='Search Partner'
            value={filter.name}
            onChange={handleName}
          />
        </div>
      ),
      filterIcon: () => (
        <SearchOutlined
          style={{ color: filter.name ? '#1890ff' : undefined }}
        />
      )
    },
    {
      title: 'Phone No',
      width: '10%',
      render: (text, record) => {
        const mobile = get(record, 'partner.partner_users[0].mobile', '-')
        return (
          <span
            className='link'
            onClick={() =>
              handleShow('usersVisible', null, 'usersData', record.partner)}
          >
            {mobile}
          </span>
        )
      }
    },
    {
      title: 'Status',
      render: (text, record) => record.truck_status && record.truck_status.name,
      width: '14%',
      filterDropdown: (
        <Radio.Group
          options={truck_status}
          defaultValue={filter.truck_statusId[0]}
          onChange={handleStatus}
          className='filter-drop-down'
        />
      )
    },
    {
      title: 'City',
      width: '14%',
      render: (text, record) => {
        return record.city && record.city.name
      }
    },
    {
      title: '',
      width: '3%',
      render: (text, record) => (
        <EditTwoTone
          onClick={() =>
            handleShow('editVisible', 'Breakdown', 'editData', record.id)}
        />
      )
    }
  ]
  return (
    <>
      <Table
        columns={columns}
        dataSource={trucks}
        rowKey={(record) => record.id}
        size='small'
        scroll={{ x: 1156 }}
        pagination={false}
        loading={loading}
      />
      {!loading && (
        <Pagination
          size='small'
          current={currentPage}
          pageSize={filter.limit}
          showSizeChanger={false}
          total={record_count}
          onChange={pageChange}
          className='text-right p10'
        />
      )}
      {object.usersVisible && (
        <PartnerUsers
          visible={object.usersVisible}
          partner={object.usersData}
          onHide={handleHide}
          title={object.title}
        />
      )}

      {object.editVisible && (
        <CreateBreakdown
          visible={object.editVisible}
          id={object.editData}
          onHide={handleHide}
          title={object.title}
        />
      )}

      {object.poVisible && (
        <CreatePo
          visible={object.poVisible}
          truck_id={object.truckId}
          onHide={handleHide}
          title={object.title}
        />
      )}
    </>
  )
}

export default Trucks
