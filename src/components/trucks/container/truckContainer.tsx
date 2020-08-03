import { Row, Col, Input, Card } from "antd";
import Trucks from "../trucks";
import { useState } from "react";

import { gql, useQuery } from "@apollo/client";

const TRUCKS_QUERY = gql`
  query trucks($offset: Int!, $limit: Int!, $trip_status_id: [Int!]) {
    truck(offset: $offset, limit: $limit) {
      truck_no
      truck_type_id
      truck_status_id
      truck_type {
        value
      }
      #city {
      #  name
      # }
      truck_status {
        id
        value
      }
      partner {
        id
        name
        partner_users(limit: 1, where: { is_admin: { _eq: true } }) {
          mobile
        }
        cardcode
      }
      trips(where: { trip_status_id: { _in: $trip_status_id } }) {
        id
        source {
          name
        }
        destination {
          name
        }
      }
    }
    truck_status {
      id
      value
    }
    truck_aggregate {
      aggregate {
        count
      }
    }
  }
`;

const { Search } = Input;

const TruckContainer = () => {
  const initialFilter = { offset: 0, limit: 2 };
  const [filter, setFilter] = useState(initialFilter);

  const trucksQueryVars = {
    offset: filter.offset,
    limit: filter.limit,
    trip_status_id: [2, 3, 4, 5, 6],
  };

  const { loading, error, data } = useQuery(TRUCKS_QUERY, {
    variables: trucksQueryVars,
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  console.log("TrucksContainer error", error);
  var truck = [];
  var truck_status = [];
  var truck_aggregate = 0;

  if (!loading) {
    truck = data.truck;
    truck_status = data.truck_status;

    truck_aggregate = data && data.truck_aggregate;
  }

  const record_count =
    truck_aggregate.aggregate && truck_aggregate.aggregate.count;
  const total_page = Math.ceil(record_count / filter.limit);

  console.log("record_count", record_count);

  const onPageChange = (value) => {
    setFilter({ ...filter, offset: value });
  };

  return (
    <Card size="small" className="card-body-0 border-top-blue">
      <Row justify="end" className="m5">
        <Col flex="180px">
          <Search
            placeholder="Search..."
            onSearch={(value) => console.log(value)}
          />
        </Col>
      </Row>
      <Row>
        <Col sm={24}>
          <Card size="small" className="card-body-0">
            <Trucks
              trucks={truck}
              status={truck_status}
              loading={loading}
              filter={filter}
              onPageChange={onPageChange}
              record_count={record_count}
              total_page={total_page}
            />
          </Card>
        </Col>
      </Row>
    </Card>
  );
};
export default TruckContainer;
