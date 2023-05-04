import Safe, { EthersAdapter } from '@safe-global/protocol-kit';
import React, { useCallback, useEffect, useState } from 'react'
import { useAccount, useProvider, useSigner } from 'wagmi'
import { ethers } from 'ethers'


export const SigningComponent = () => {

  const { address: userAddress } = useAccount()
  const provider = useProvider();
  const {data: signer} = useSigner();
  
  const [ethAdapter, setEthAdapter] = useState<EthersAdapter>()
  const [safe, setSafe] = useState<Safe>()
  const FIXED_SAFE_ADDRESS = '' //gor:

  useEffect(() => {
    if (!provider) return

    const _ethAdapter = new EthersAdapter({
      ethers: ethers,
      signerOrProvider: signer || provider
    })

    ;(async () => {
      const sdk = await Safe.create({
        ethAdapter: _ethAdapter,
        safeAddress: FIXED_SAFE_ADDRESS
      })
      if (signer) {
        const safe = await sdk.connect({
          ethAdapter: new EthersAdapter({
            ethers: ethers,
            signerOrProvider: signer
          }),
          safeAddress: FIXED_SAFE_ADDRESS
        })
        setSafe(safe)
      }
    })()

    setEthAdapter(_ethAdapter)
  }, [provider, signer])

  useEffect(() => {
    if (!safe || !userAddress) return
    ;(async () => {
      console.log('is owner: ', await safe.isOwner(userAddress))
    })()
  }, [safe, userAddress])


  const sign = useCallback(async () => {
    const ethSig = await safe?.signTransactionHash("0xd2ea3fd711026aaa386a8aa22b0e65a67af6266a39dcdb14f2343565ae39d65e")
    console.log(ethSig)
  }, [safe])

  return <div>
    <div>connected to {userAddress} </div>
    <button onClick={sign}>Sign</button>
  </div>
}