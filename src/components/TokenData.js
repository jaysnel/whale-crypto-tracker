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
          const parsedAmount = parseInt(amount.toString());
          if(parsedAmount >= Transfer_Threshold) {
            console.log(`New Whale Transfer for: ${name} - https://etherscan.io/tx/${data.transactionHash}`)
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
        {name}
      </div>
      <div>
        {
          tokenData.map((token, idx) => {
            return (
              <div key={idx}>
                {`${token.to} => ${token.from}`}
              </div>
            )
          })
        }
      </div>
    </>
  )
}
