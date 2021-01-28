import { Table, Pagination, Radio, Input, DatePicker, Checkbox, Button, Tooltip, Space } from 'antd'
import { useState } from 'react'
import { EditTwoTone, SearchOutlined, InsuranceTwoTone, CheckCircleTwoTone } from '@ant-design/icons'
import CreateBreakdown from '../../components/trucks/createBreakdown'
import PartnerUsers from '../partners/partnerUsers'
import CreatePo from '../../components/trips/createPo'
import useShowHidewithRecord from '../../hooks/useShowHideWithRecord'
import get from 'lodash/get'
import LinkComp from '../common/link'
import InsuranceExpiry from './insuranceExpiryDateEdit'
import PartnerLink from '../common/PartnerLink'
import CreateInsurance from './createInsuranceLead'
import u from '../../lib/util'

const Trucks = (props) => {
  const initial = {
    usersData: [],
    usersVisible: false,
    truckId: [],
    poVisible: false,
    editVisible: false,
    editData: [],
    title: '',
    insuranceVisible: false
  }
  const { object, handleHide, handleShow } = useShowHidewithRecord(initial)
  const [currentPage, setCurrentPage] = useState(1)
  const regions = u.regions
  const {
    trucks,
    loading,
    record_count,
    onPageChange,
    onInsuranceFilter,
    onTruckNoSearch,
    filter,
    onRegionFilter,
    truck_status_list,
    onFilter
  } = props

  const pageChange = (page, pageSize) => {
    const newOffset = page * pageSize - u.limit
    setCurrentPage(page)
    onPageChange(newOffset)
  }

  const handleStatus = (e) => {
    onFilter(e.target.value)
  }
  const handleInsuranceFilter = (e) => {
    onInsuranceFilter(e.target.value)
  }

  const handleTruckNo = (e) => {
    onTruckNoSearch(e.target.value)
  }

  const handlePartnerRegion = (checked) => {
    onRegionFilter(checked)
  }
  const truck_status = truck_status_list.map((data) => {
    return { value: data.id, label: data.name }
  })
  
  const regionsList = regions.map((data) => {
    return { value: data.text, label: data.text }
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
      width: '5%',
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
        const id = get(record, 'partner.id', null)
        const cardcode = get(record, 'partner.cardcode', null)
        const name = get(record, 'partner.name', null)
        return (
          <PartnerLink type='partners' data={name} cardcode={cardcode} id={id} length={20} />
        )
      },

      filterDropdown: (
          <Checkbox.Group
          options={regionsList}
          defaultValue={filter.region}
          onChange={handlePartnerRegion}
          className='filter-drop-down'
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
      width: '12%',
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
      title: 'Ins Expiry Date',
      width: '15%',
      render: (text, record) => <InsuranceExpiry record={record} />,
      filterDropdown: (
        <Radio.Group
          options={[{ value: 'All', label: 'All' }, { value: '15', label: '<15' }, { value: '30', label: '<30' }]}
          defaultValue='All'
          onChange={handleInsuranceFilter}
          className='filter-drop-down'

        />
      )
    },
    {
      title: 'City',
      width: '10%',
      render: (text, record) => {
        return record.city && record.city.name
      }
    },
    {
      title: '',
      width: '6%',
      render: (text, record) => (
        <Space className="actions">
          {record && record.insurance ?
            <Tooltip title="Insurance Lead Created">
              <CheckCircleTwoTone /></Tooltip> :
            <Tooltip title="Insurance Lead">
              <InsuranceTwoTone
                onClick={() =>
                  handleShow('insuranceVisible', 'Insurance Lead', 'insuranceData', record)}
              />
            </Tooltip>}
          <EditTwoTone
            onClick={() =>
              handleShow('editVisible', 'Breakdown', 'editData', record.id)}
          />
        </Space>
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
          pageSize={u.limit}
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

      {object.insuranceVisible && (
        <CreateInsurance
          visible={object.insuranceVisible}
          record={object.insuranceData}
          onHide={handleHide}
          title={object.title}
        />
      )}
    </>
  )
}

export default Trucks
