import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";

export default function TokenData() {
  const [name, setName] = useState('')
  const { tokenName } = useParams();
  const { ethers, Contract} = require('ethers')
  const tokenList = require('../token-address/tokens.json')
  const generalABI = require('../abi/GENERAL_ERC20_CONTRACT_ABI.json')
  const getToken = (coin) => {
    try {
      const currentToken = tokenList.filter(tkn => tkn.name === coin)
      return {
          name: currentToken[0].name, 
          address: currentToken[0].address
      };
    } catch (err) {
      console.log(err)
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
        setName(name)
        console.log('Data: ', name)
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