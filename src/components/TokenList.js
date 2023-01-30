import React from 'react'
import { Link } from 'react-router-dom';


export default function TokenList() {
    const tokenList = require('../token-address/tokens.json')
  return (
    <>
        { tokenList.map(token => {
            return (
                <div key={token.name}>
                    <Link to={`/token/${token.name}`}>
                        <h3>{token.name}</h3>
                    </Link>
                </div>
            )
        }) }
    </>
  )
}
