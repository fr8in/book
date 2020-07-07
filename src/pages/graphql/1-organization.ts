import { gql } from "apollo-server-micro";

import { DateTimeResolver, DateResolver } from "graphql-scalars";
import { resolver } from "graphql-sequelize";
import db from "../../db/models";
const { Bank, State, Region, City, Branch } = db
const typeDefs = gql`
  interface Node {
    id: ID!
  }
  scalar DateTime
  scalar EmailAddress
  scalar JSON
  scalar Date
  type PageInfo {
    endCursor: String
    startCursor: String
    hasPreviousPage: Boolean
    hasNextPage: Boolean
  }
  type City {
    id: Int
    name: String
    lat: Float
    lng: Float
    connectedCityId: Int
    connectedCity: City
    isConnectedCity: Boolean
    branchId: Int
    branch: Branch
    stateId: Int
    state: State
  }

  type State {
    id: Int
    name: String
  }
  type Region {
    id: Int
    name: String
  }
  type Branch {
    id: Int
    name: String
    regionId: Int
    region: Region
  }
  type Bank {
    id: Int
    name: String
  }
  type Employee {
    id: Int
    name: String
    email: String
    role: [String]
    branchId: Int
    branch: Branch
    regionId: Int
    region: Region
    banks: [Bank]
    regions: [Region]
    states: [State]
    cities: [City]
    trips: TripConnection
  }
`;

const resolvers = {
  DateTime: DateTimeResolver,
  Date: DateResolver,
  Query: {
    employee: () => {
      return {
        id: 1,
      };
    },
  },
  Employee: {
    banks: resolver(Bank),
    regions: resolver(Region),
    states: resolver(State),
    cities: resolver(City),
  },
  Branch: {
    region: resolver(Branch.Region),
  },
  City: {
    state: resolver(City.State),
    branch: resolver(City.Branch),
    connectedCity: resolver(City.ConnectedCity),
  },
};
export default { typeDefs, resolvers };
