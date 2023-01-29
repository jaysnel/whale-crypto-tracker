const { ethers, Contract} = require('ethers')
const tokenList = require('./token-address/tokens.json')
const generalABI = require('./abi/GENERAL_ERC20_CONTRACT_ABI.json')

const getTokenFunction = (coin) => {
    const currentToken = tokenList.filter(tkn => tkn.name === coin)
    return {
        name: currentToken[0].name, 
        address: currentToken[0].address
    };
}
const ethRpcURL = 'https://cloudflare-eth.com'
const UsdcContractAddresss = getTokenFunction('ETH')
const provider = new ethers.providers.JsonRpcProvider(ethRpcURL)
const contract = new Contract(UsdcContractAddresss.address, generalABI, provider)

const main = async () => {
    try {
        const name = await contract.name()
        console.log(`Whale Tracker currently listening for ${name} tokens...`)
    } catch (err) {
        console.log('ERR: ', err)
    }
}

main();