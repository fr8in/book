import { Table, Input, Switch, Popconfirm, Button, Tooltip, message, Pagination, Checkbox, Modal, Radio } from 'antd'
import {
  CommentOutlined,
  CloseOutlined,
  SearchOutlined,
  EditTwoTone
} from '@ant-design/icons'
import userContext from '../../lib/userContaxt'
import { useState, useContext } from 'react'
import moment from 'moment'
import { gql, useQuery, useMutation, useSubscription } from '@apollo/client'
import EmployeeList from '../branches/fr8EmpolyeeList'
import useShowHideWithRecord from '../../hooks/useShowHideWithRecord'
import Comment from '../../components/partners/comment'
import InlineCitySelect from '../common/inlineCitySelect'
import u from '../../lib/util'
import Truncate from '../common/truncate'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import EditAccess from '../common/editAccess'
import Phone from '../common/phone'
import LinkComp from '../common/link'
import ReferredByPartner from '../partners/referredByPartnerList'

const PARTNERS_LEAD_QUERY = gql`
query partner_lead_aggregate($where: partner_bool_exp, $offset: Int!, $limit: Int!) {
  partner(offset: $offset, limit: $limit, where: $where) {
    id
    name
    cardcode
    created_at
    lead_priority
    referred_by {
      id
      name
      cardcode
    }
    onboarded_by {
      id
      email
    }
    partner_users {
      mobile
    }
    city {
      id
      name
    }
    channel {
      id
      name
    }
    partner_status {
      name
    }
    last_comment {
      description
    }
    partner_comments {
      created_at
      description
    }
  }
  partner_aggregate(where: $where) {
    aggregate {
      count
    }
  }
  channel(where: {id: {_nin: [7, 8, 9]}}) {
    id
    name
  }
}
  `
const LEAD_REJECT_MUTATION = gql`
  mutation partner_lead_reject($partner_status_id:Int,$id:Int!,$updated_by: String! ){
    update_partner_by_pk(
        pk_columns: { id: $id }
        _set: { partner_status_id: $partner_status_id,updated_by:$updated_by }) 
    {
      id
      name
    }
  }
`
const UPDATE_LEAD_PRIORITY_STATUS_MUTATION = gql`
mutation lead_priority_status($lead_priority: Boolean, $id: Int,$updated_by: String!) {
  update_partner(_set: {lead_priority: $lead_priority,updated_by:$updated_by}, where: {id: {_eq: $id}}) {
    returning {
      id
      lead_priority
    }
  }
}
`
const UPDATE_LEAD_CITY_MUTATION = gql`
mutation update_lead_city($city_id:Int,$id:Int,$updated_by: String!) {
  update_partner(_set: {city_id: $city_id,updated_by:$updated_by}, where: {id: {_eq: $id}}) {
    returning {
      id
      city_id
    }
  }
}
`

const no_comment = [{ value: 1, label: 'No Comment' }]

const PartnerLead = (props) => {
  const { visible, onHide, onboarded_by } = props
  const initial = {
    no_comment: [],
    comment: false,
    employeeList: false,
    ownerVisible: false,
    ownerData: [],
    referredByVisible: false,
    referredByData: [],
    offset: 0,
    limit: u.limit,
    mobile: null,
    city_name: null,
    owner_name: null,
    partner_status_name: ['Lead', 'Registered','Verification'],
    channel_name: null
  }

  const [filter, setFilter] = useState(initial)
  const [currentPage, setCurrentPage] = useState(1)
  const { object, handleHide, handleShow } = useShowHideWithRecord(initial)
  const [selectedPartners, setSelectedPartners] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const context = useContext(userContext)

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    const partner_list = selectedRows && selectedRows.length > 0 ? selectedRows.map(row => row.id) : []
    setSelectedRowKeys(selectedRowKeys)
    setSelectedPartners(partner_list)
  }

  const { role } = u
  const cityEdit = [role.admin, role.partner_manager, role.billing,role.onboarding]
  const ownerEdit = [role.admin, role.partner_manager, role.billing,role.onboarding]
  const rejectEdit = [role.admin, role.partner_manager, role.billing,role.onboarding,role.sourcing]
  const priorityEdit = [role.admin, role.partner_manager, role.billing,role.onboarding]
  const referredByEdit = [role.admin, role.partner_manager,role.onboarding]
  const priorityEditAccess = u.is_roles(priorityEdit,context)
  const rejectEditAccess = u.is_roles(rejectEdit,context)

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  }

  const where = {
    partner_users: filter.mobile ? { mobile: { _like: `%${filter.mobile}%` } } : null,
    partner_status: { name: { _in: !isEmpty(filter.partner_status_name) ? filter.partner_status_name : null } },
    ...!isEmpty(onboarded_by) ? { onboarded_by: { email: { _ilike: filter.owner_name ? `%${filter.owner_name}%` : null, _in: onboarded_by || null } } } : filter.owner_name ? { onboarded_by: { email: { _ilike: filter.owner_name ? `%${filter.owner_name}%` : null } } } : null,
    ...filter.city_name && { city: { name: { _ilike: `%${filter.city_name}%` } } },
    ...!isEmpty(filter.channel_name) && { channel: { name: { _in: filter.channel_name } } },
    _not: {
      last_comment: !isEmpty(filter.no_comment) ? null : { id: { _is_null: true } }
    }
  }

  const variables = {
    offset: filter.offset,
    limit: filter.limit,
    where: where
  }
 
  const { loading, error, data } = useQuery(
    PARTNERS_LEAD_QUERY, {
      variables: variables,
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    })
  console.log('partnerLead error', error)

  const [rejectLead] = useMutation(
    LEAD_REJECT_MUTATION, {
      onError (error) {
        message.error(error.toString())
      },
      onCompleted () {
        message.success('Updated!!')
      }
    })
  const onSubmit = (id) => {
    rejectLead({
      variables: {
        partner_status_id: 2,
        id: id,
        updated_by: context.email
      }
    })
  }

  const [updateStatusId] = useMutation(
    UPDATE_LEAD_PRIORITY_STATUS_MUTATION,
    {
      onError (error) {
        message.error(error.toString())
      },
      onCompleted () {
        message.success('Updated!!')
      }
    })
  const onChange = (checked, id) => {
    updateStatusId({
      variables: {
        id: id,
        lead_priority: checked,
        updated_by: context.email
      }
    })
  }

  const [updateCity] = useMutation(
    UPDATE_LEAD_CITY_MUTATION, {
      onError (error) {
        message.error(error.toString())
      },
      onCompleted () {
        message.success('Updated!!')
      }
    })
  const onCityUpdate = (partner_id, city_id) => {
    updateCity({
      variables: {
        city_id: city_id,
        id: partner_id,
        updated_by: context.email
      }
    })
  }

  let lead_data = {}
  if (!loading) {
    lead_data = data
  }
  
  const partners = get(lead_data, 'partner', [])
  const referredByName = get(partners, 'referred_by.name', null)
  

  

  const partner_aggregate = get(lead_data, 'partner_aggregate', 0)
  const partners_status = ["Lead","Registered","Rejected","Verification","Reverification"]
  const channel = get(lead_data, 'channel', [])

  const record_count = get(partner_aggregate, 'aggregate.count', 0)
  
  const channels = channel.map((data) => {
    return { value: data.name, label: data.name }
  })

  const pageChange = (page, pageSize) => {
    const newOffset = page * pageSize - filter.limit
    setCurrentPage(page)
    setFilter({ ...filter, offset: newOffset })
  }

  const handleStatus = (checked) => {
    setCurrentPage(1)
    setFilter({ ...filter, partner_status_name: checked, offset: 0 })
  }

  const handleNoComment = (checked) => {
    setCurrentPage(1)
    setFilter({ ...filter, no_comment: checked, offset: 0 })
  }

  const handleChannelStatus = (checked) => {
    setCurrentPage(1)
    setFilter({ ...filter, channel_name: checked, offset: 0 })
  }

  const handleMobile = (e) => {
    setFilter({ ...filter, mobile: e.target.value, offset: 0 })
  }

  const handleCityName = (e) => {
    setFilter({ ...filter, city_name: e.target.value, offset: 0 })
  }

  const handleOwnerName = (e) => {
    setFilter({ ...filter, owner_name: e.target.value, offset: 0 })
  }

  const columnsCurrent = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: '8%',
      render: (text, record) => {
        <Truncate data={text} length={9} />
        const id = get(record, 'id', null)
        const status = get(record,'partner_status.name',null)
        const cardcode = get(record,'cardcode',null)
        const name = get(record,'name',null)
        return (
          status === 'Reverification' ?
          <LinkComp type='partners' data={name} id={cardcode} length={8} /> :
          <LinkComp type='partners/create-partner' data={text} id={id} length={8} />
        )
      }
    },
    {
      title: 'Referred By',
      width: '9%',
      render: (text, record) => {
        const name = get(record, 'referred_by.name', null)
        const cardcode = get(record, 'referred_by.cardcode', null)
        return (
          <div>
            <span> <LinkComp type='partners' data={name} id={cardcode} length={5} />&nbsp;</span>
            <EditAccess edit_access={referredByEdit} onEdit={() => handleShow('referredByVisible', null, 'referredByData', record.id)} />
          </div>
        )
      }
    },
    {
      title: 'Phone',
      dataIndex: 'number',
      width: '8%',
      render: (text, record) => {
        return <Phone number={record.partner_users[0] && record.partner_users[0].mobile} />
      },
      filterDropdown: (
        <div>
          <Input
            placeholder='Search Phone Number'
            id='number'
            name='number'
            type='number'
            value={filter.mobile}
            onChange={handleMobile}
          />
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      )
    },
    {
      title: 'City',
      width: '10%',
      render: (text, record) => {
        return (
          <InlineCitySelect
            label={record.city && record.city.name}
            handleChange={onCityUpdate}
            partner_id={record.id}
            edit_access={cityEdit}
          />
        )
      },

      filterDropdown: (
        <div>
          <Input
            placeholder='Search City Name'
            id='cityName'
            name='cityName'
            value={filter.city_name}
            onChange={handleCityName}
          />
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      )
    },
    {
      title: 'Owner',
      dataIndex: 'owner',
      width: '16%',
      render: (text, record) => {
        const owner = record.onboarded_by && record.onboarded_by.email
        return (
          <div>
            <span>{owner}&nbsp;</span>
            <EditAccess edit_access={ownerEdit} onEdit={() => handleShow('ownerVisible', null, 'ownerData', record.id)} />
          </div>
        )
      },
      filterDropdown: (
        <div>
          <Input
            placeholder='Search Employee Name'
            id='owner'
            name='owner'
            value={filter.owner_name}
            onChange={handleOwnerName}
          />
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      )
    },
    {
      title: 'Channel',
      dataIndex: 'source',
      width: '8%',
      filterDropdown: (
        <Checkbox.Group
          options={channels}
          defaultValue={filter.channel_name}
          onChange={handleChannelStatus}
          className='filter-drop-down'
        />
      ),
      render: (text, record) => {
        return record.channel && record.channel.name
      }
    },
    {
      title: 'Status',
      width: '8%',
      filterDropdown: (
        <Checkbox.Group
          options={partners_status}
          defaultValue={filter.partner_status_name}
          onChange={handleStatus}
          className='filter-drop-down'
        />
      ),
      render: (text, record) => {
        return record.partner_status && record.partner_status.name
      }
    },
    {
      title: 'Last Comment',
      dataIndex: 'comment',
      width: '12%',
      render: (text, record) => {
        const comment = record.last_comment && record.last_comment.description
        return <Truncate data={comment} length={17} />
      },
      filterDropdown: (
        <Checkbox.Group
          options={no_comment}
          defaultValue={filter.no_comment}
          onChange={handleNoComment}
          className='filter-drop-down'
        />
      )

    },
    {
      title: 'Created At',
      dataIndex: 'date',
      width: '9%',
      render: (text, record) => record.created_at ? moment(record.created_at).format('DD-MMM-YY') : '-',
      sorter: (a, b) => (a.created_at > b.created_at ? 1 : -1)
    },
    {
      title: 'Priority',
      dataIndex: 'lead_priority',
      width: '5%',
      render: (text, record) => priorityEditAccess ? <Switch onChange={(checked) => onChange(checked, record.id)} checked={text} /> : null
    },
    {
      title: 'Action',
      dataIndex: 'action',
      width: '7%',
      render: (text, record) => (
        <span className='actions'>
          <Tooltip title='Comment'>
            <Button
              type='link'
              icon={<CommentOutlined />}
              onClick={() =>
                handleShow('commentVisible', null, 'commentData', record.id)}
            />
          </Tooltip>
          {rejectEditAccess ? (
            <Popconfirm
              title='Are you sure want to Reject the lead?'
              okText='Yes'
              cancelText='No'
              onConfirm={() => onSubmit(record.id)}
            >
              <Button
                type='primary'
                size='small'
                shape='circle'
                danger
                icon={<CloseOutlined />}
              />
            </Popconfirm>) : null}
        </span>
      )
    }
  ]
  return (
    <>
      <Table
        rowSelection={{
          ...rowSelection
        }}
        columns={columnsCurrent}
        dataSource={partners}
        rowKey={(record) => record.id}
        size='small'
        scroll={{ x: 1156 }}
        pagination={false}
        loading={loading}
        className='withAction'
      />
      {!loading && record_count
        ? (
          <Pagination
            size='small'
            current={currentPage}
            pageSize={filter.limit}
            showSizeChanger={false}
            total={record_count}
            onChange={pageChange}
            className='text-right p10'
          />) : null}
      {object.commentVisible && (
        <Modal
          title='Comments'
          visible={object.commentVisible}
         onCancel={handleHide}
          bodyStyle={{ padding: 10 }}
          width={600}
          footer={[]}
        >
          <Comment partner_id={object.commentData} />
        </Modal>)}
      {visible && (
        <EmployeeList
          visible={visible}
          onHide={onHide}
          partner_ids={selectedPartners}
        />
      )}
      {object.ownerVisible && (
        <EmployeeList
          visible={object.ownerVisible}
          partner_ids={object.ownerData}
          onHide={handleHide}
        />
      )}
       {object.referredByVisible && (
        <ReferredByPartner
          visible={object.referredByVisible}
          partner_id={object.referredByData}
          onHide={handleHide}
          initialValue={referredByName}
        />
      )}
    </>
  )
}

export default PartnerLead
