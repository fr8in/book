import { gql } from '@apollo/client'

export const UPDATE_PARTNER_WALLET_STATUS_MUTATION = gql`
mutation partnerWalletStatus($wallet_block:Boolean,$cardcode:String) {
    update_partner(_set: {wallet_block:$wallet_block}, where: {cardcode: {_eq:$cardcode}}) {
      returning {
        id
        wallet_block
      }
    }
  }
  
`