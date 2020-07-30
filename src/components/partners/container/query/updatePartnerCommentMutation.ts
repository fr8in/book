import { gql } from '@apollo/client'

export const INSERT_PARTNER_COMMENT_MUTATION = gql`
mutation PartnerComment($description:String, $topic:String, $partner_id: Int, $created_by:String ) {
  insert_partner_comment(objects: {description: $description, partner_id: $partner_id, topic: $topic, created_by: "shilpa@fr8.in"}) {
    returning {
      description
      partner_id
    }
  }
}
`
