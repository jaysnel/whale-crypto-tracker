import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";

export default function TokenData() {
  const [name, setName] = useState('')
  const [tokenData, setTokenData] = useState([])
  const { tokenName } = useParams();
  const { ethers, Contract} = require('ethers')
  const tokenList = require('../token-address/tokens.json')
  const generalABI = require('../abi/GENERAL_ERC20_CONTRACT_ABI.json')
  const getToken = (coin) => {
    const currentToken = tokenList.filter(tkn => tkn.name === coin)
      return currentToken[0]
  }
  const bigNumberForHumans = (bigNumber) => {
    return parseInt(bigNumber.toString())
  }
  const getTokenData = async() => {
    try {
      if(ethers) {
        const ethRpcURL = 'https://cloudflare-eth.com'
        const tokenContractAddresss = getToken(tokenName.toUpperCase())
        const provider = new ethers.providers.JsonRpcProvider(ethRpcURL)
        const contract = new Contract(tokenContractAddresss.address, generalABI, provider)
        const name = await contract.name()
        const Transfer_Threshold = tokenContractAddresss.transfer_threshold
        
        setName(name)
        
        contract.on('Transfer', (from, to, amount, data) => {
          const parsedAmount = bigNumberForHumans(amount);
          if(parsedAmount >= Transfer_Threshold) {
            console.log(`New Whale Transfer for: ${name} - https://etherscan.io/tx/${data.transactionHash}`)
            console.log(data)
            const thisTokenData = {
              from,
              to,
              amount,
              data
            }
            setTokenData(tokenData => [...tokenData, thisTokenData])
          }
        })
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getTokenData()
  }, [])
  
  return (
    <>
      <div>
        <table>
          <caption>{name}</caption>
          <thead>
            <tr>
              <th scope="col">To</th>
              <th scope="col">From</th>
              <th scope="col">Amount</th>
              <th scope="col">Txn</th>
            </tr>
          </thead>
          <tbody>
            {
              tokenData.map((token, idx) => {
                return (
                  <tr key={idx}>
                    <td data-label="To">{token.to}</td>
                    <td data-label="To">{token.from}</td>
                    <td data-label="Amount">{bigNumberForHumans(token.amount)}</td>
                    <td data-label="Transaction">{`Txn: https://etherscan.io/tx/${token.data.transactionHash}`}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    </>
  )
}
