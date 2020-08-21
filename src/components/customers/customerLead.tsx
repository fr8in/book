import { Table, Input, Switch, Button, Tooltip, Popconfirm, Space,Pagination ,message , Modal} from "antd";
import {
  SearchOutlined,
  CommentOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import moment from 'moment'
import { useState } from 'react'
import useShowHideWithRecord from "../../hooks/useShowHideWithRecord";
import CustomerComment from '../customers/customerComment'
import { gql, useQuery, useMutation } from '@apollo/client'

const CUSTOMERS_LEAD_QUERY = gql`
  query customers( $offset: Int!
    $limit: Int!
    $mobile: String){
    customer(  offset: $offset
      limit: $limit where: {status: {name: {_in: ["Lead", "Registered", "Rejected"]}}, mobile: {_like:$mobile }}){
      id
      cardcode
      name
      mobile
     status{
      id
      name
    }
    customer_comments{
      id
      topic
      description
      created_at
      created_by
    }
    }
    customer_aggregate(where: {status: {name: {_in: ["Lead","Registered","Rejected"]}}}){
      aggregate{
        count
      }
    }
  }
`  

const LEAD_REJECT_MUTATION = gql`
mutation customer_lead_reject($status_id:Int,$id:Int! ) {
  update_customer_by_pk(pk_columns: {id: $id}, _set: {status_id: $status_id}) {
    id
    name
  }
}
`

const CusSource = [
  { value: 1, text: "DIRECT" },
  { value: 2, text: "SOCIAL MEDIA" },
  { value: 3, text: "REFERRAL" },
  { value: 4, text: "APP" },
];
const CusState = [
  { value: 1, text: "OPEN" },
  { value: 2, text: "ON-BOARDED" },
  { value: 3, text: "REJECTED" },
];

const CustomerLead = () => {
  const onChange = (checked) => {
    console.log(`checked = ${checked}`);
  };
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User", // Column configuration not to be checked
      name: record.name,
    }),
  };
  const initial = {
    commentData: [],
    commentVisible: false,
    offset: 0,
    limit: 10,
    mobile: null,
  };

  const { object, handleHide, handleShow } = useShowHideWithRecord(initial);

  const [filter, setFilter] = useState(initial)
  const [currentPage, setCurrentPage] = useState(1)

  const customerQueryVars = {
    offset: filter.offset,
    limit: filter.limit,
    mobile: filter.mobile ? `%${filter.mobile}%` : null
  }


  const { loading, error, data } = useQuery(
    CUSTOMERS_LEAD_QUERY, {
      variables: customerQueryVars,
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true
  })
  console.log('partnerLead error', error)

  const [insertComment] = useMutation(
    LEAD_REJECT_MUTATION, {
    onError(error) {
      message.error(error.toString());
    },
    onCompleted() {
      message.success("Updated!!");
    },
  });
  const onSubmit = (id) => {
    insertComment({
      variables: {
        status_id: 7,
        id: id,
      },
    });
  };

  var customer = []
  var customer_aggregate = 0;
  
  if (!loading) {
    customer = data && data.customer
    customer_aggregate = data && data.customer_aggregate
  }

  const record_count =
  customer_aggregate &&
  customer_aggregate.aggregate &&
  customer_aggregate.aggregate.count;
console.log("record_count", record_count)

Pagination
const onPageChange = (value) => {
  setFilter({ ...filter, offset: value })
}

const onMobileSearch = (value) => {
  setFilter({ ...filter, mobile: value })
};

const pageChange = (page, pageSize) => {
  const newOffset = page * pageSize - filter.limit
  setCurrentPage(page)
  onPageChange(newOffset)
}

const handleMobile = (e) => {
  onMobileSearch(e.target.value);
};


  const columnsCurrent = [
    {
      title: "Company",
      dataIndex: "company",
    },
    {
      title: "User",
      dataIndex: "name",
    },
    {
      title: "Phone",
      dataIndex: "mobile",
      filterDropdown: (
        <div>
          <Input
            placeholder="Search Phone Number"
            id="number"
            name="number"
            type="number"
            value={filter.mobile}
            onChange={handleMobile}
          />
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
    },
    {
      title: "City",
      dataIndex: "cityName",
      filterDropdown: (
        <div>
          <Input placeholder="Search City Name" id="cityName" name="cityName" />
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
    },
    {
      title: "Owner",
      dataIndex: "owner",
      filterDropdown: (
        <div>
          <Input placeholder="Search Employee Name" id="owner" name="owner" />
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
    },
    {
      title: "Source",
      dataIndex: "source",
      filters: CusSource,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => {
        return record.status && record.status.name;
      },
      filters: CusState,
    },
    {
      title: "Comment",
      dataIndex: "comment",
      render: (text, record) => {
        const comment = record.customer_comments && record.customer_comments.length > 0 &&
          record.customer_comments[0].description ? record.customer_comments[0].description : '-'
        return comment && comment.length > 20 ? (
          <Tooltip title={comment}>
            <span> {comment.slice(0, 20) + '...'}</span>
          </Tooltip>
        ) : (
            comment
          )
      },
    },
    {
      title: "Created Date",
      dataIndex: "date",
      render: (text, record) => {
        const create_date = record.customer_comments && record.customer_comments.length > 0 &&
          record.customer_comments[0].created_at ? record.customer_comments[0].created_at : '-'
        return (create_date ? moment(create_date).format('DD-MMM-YY') : null)
      },
      sorter: (a, b) => (a.date > b.date ? 1 : -1),
    },
    {
      title: "Priority",
      dataIndex: "priority",
      render: (text, record) => <Switch onChange={onChange} size="small" />,
    },
    {
      title: "Action",
      render: (text, record) => (
        <Space>
          <Tooltip title="Comment">
            <Button
              type="link"
              icon={<CommentOutlined />}
              onClick={() =>
                handleShow(
                  "commentVisible",
                  null,
                  "commentData",
                  record.id
                )
              }
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure want to Reject the lead?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => onSubmit(record.id)}
          >
            <Button
              type="primary"
              size="small"
              shape="circle"
              danger
              icon={<CloseOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];
  return (
    <>
      <Table
        rowSelection={{
          ...rowSelection,
        }}
        columns={columnsCurrent}
        dataSource={customer}
        rowKey={(record) => record.id}
        size="middle"
        scroll={{ x: 1156 }}
        pagination={false}
      />
       {!loading && record_count
        ? (
          <Pagination
            size='small'
            current={currentPage}
            pageSize={filter.limit}
            total={record_count}
            onChange={pageChange}
            className='text-right p10'
          />) : null
      }
       {object.commentVisible && (
        <Modal
          title='Comments'
          visible={object.commentVisible}
          onCancel={handleHide}
          bodyStyle={{ padding: 10 }}
          footer={null}
        >
          <CustomerComment customer_id={object.commentData} />
        </Modal>)
      }
    </>
  );
};

export default CustomerLead;
