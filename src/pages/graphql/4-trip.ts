import { gql } from "apollo-server-micro";
import {
  createNodeInterface,
  createConnectionResolver,
} from "graphql-sequelize";
import sequelize from "sequelize";
import db from "../../db/models";
const { nodeTypeMapper } = createNodeInterface(sequelize);
const typeDefs = gql`
  enum TripOrderBy {
    ID
  }
  enum TruckStatus {
    Verification
    Pending
    Deactivated
    Waiting
    For
    Load
    Assigned
    Confirmed
    Loading
    Intransit
    OnHold
    Unloading
    Delivered
  }

  type Trip {
    id: Int
    customerPrice: Float
    mamul: Float
    partnerPrice: Float
    sourceId: Int
    source: String
    branchId: Int
    branch: String
    employeeId: Int
    employee: String
    destinationId: Int
    destination: String
    truckTypeId: Int
    truckType: String
    km: Int
    truckId: Int
    customerId: Int
    customer: String
    partnerId: Int
    orderDate: Date
    poDate: Date
    deliveryDate: Date
    ETA: Date
    delay: Float
    sourceIn: Date
    sourceOut: Date
    destinationIn: Date
    destinationOut: Date
    driverNo: String
    status: TruckStatus
    createdBy: String
    deletedAt: Date
    createdAt: Date
    updatedAt: Date
    LR: String
    POD: String
    LR_URL: String
    POD_URL: String
    comment: JSON
    customerConfirmation: Boolean
  }
  type TripEdge {
    node: Trip
    cursors: String!
  }

  type TripConnection {
    pageInfo: PageInfo!
    edges: [TripEdge]
    total: Int
  }
`;
nodeTypeMapper.mapTypes({
  [db.Trip.name]: "Trip", // Supports both new GraphQLObjectType({...}) and type name
});

const resolvers = {
  Employee: {
    trips: createConnectionResolver({
      target: db.Trip,
      // orderBy: 'TripOrderBy', // supports both new GraphQLEnumType({...}) and type name
    }).resolveConnection,
  },
};
export default { typeDefs, resolvers };
