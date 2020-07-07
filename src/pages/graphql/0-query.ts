import { gql } from 'apollo-server-micro'
const typeDefs = gql`

type Query{
      employee:Employee
      # partner:Partner
   }
 `


export default { typeDefs }


