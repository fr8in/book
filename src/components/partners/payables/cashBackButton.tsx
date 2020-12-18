import React, { useState } from 'react'
import { Button, message } from 'antd'
import { gql, useQuery, useMutation } from '@apollo/client'



const TOKEN = gql`query token($ref_id:Int!,$process:String!){
    token(ref_id:$ref_id,process:$process)
  }`


const PROCESS_CASHBACK = gql`mutation process_cashback($year:Int!,$month:Int!,$token:String!) {
    process_transaction_fee_cahsback(year:$year, month:$month, token:$token) {
      status
      description
    }
  }`

const cashBackButton = (props) => {
    const [buttonLoading, setButtonLoading] = useState(false)

    const { data: tokenData, loading: tokenLoading, refetch } = useQuery(TOKEN, {
        skip: !props.year || !props.month,
        variables: {
            ref_id: props.year + props.month,
            process: "TRANSACTION_FEE_CASHBACK"
        }
    })

    let token = null
    if (!tokenLoading && tokenData) {
        token = tokenData.token
    }

    const [process] = useMutation(PROCESS_CASHBACK,
        {
            onError(error) { message.error(error.toString()) },
            onCompleted(data) {
                console.log("data", data)
                if (data.process_transaction_fee_cahsback.status === "OK") {
                    message.success(data.process_transaction_fee_cahsback.description)
                }
                else {
                    message.error(data.process_transaction_fee_cahsback.description ?
                        data.process_transaction_fee_cahsback.description : "Unexpected Error")
                }
                setTimeout(() => {
                    refetch()
                }, 50000)
                setButtonLoading(false)
            }
        }
    )


    const processCashBack = () => {
        setButtonLoading(true)
        process({
            variables: {
                year: props.year,
                month: props.month,
                token
            }
        })
    }

    return (
        props.year && props.month ?
            <Button loading={buttonLoading} type="primary" onClick={processCashBack}>Process</Button> : <div />
    )
}

export default cashBackButton