import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";

export default function TokenData() {
  const [name, setName] = useState('')
  const { tokenName } = useParams();
  const { ethers, Contract} = require('ethers')
  const tokenList = require('../token-address/tokens.json')
  const generalABI = require('../abi/GENERAL_ERC20_CONTRACT_ABI.json')
  const getToken = (coin) => {
    const currentToken = tokenList.filter(tkn => tkn.name === coin)
      return {
          name: currentToken[0].name, 
          address: currentToken[0].address
      }
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
          // console.log(parseInt(amount.toString()))
          // console.log(`New Whale Transfer for: ${name} - https://etherscan.io/tx/${data.transactionHash}`)
          const parsedAmount = parseInt(amount.toString());
          if(parsedAmount >= Transfer_Threshold) {
            console.log(`New Whale Transfer for: ${name} - https://etherscan.io/tx/${data.transactionHash}`)
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
    <div>
      {name}
    </div>
  )
}
