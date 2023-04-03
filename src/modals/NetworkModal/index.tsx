import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import HeadlessUiModal from 'app/components/Modal/HeadlessUIModal'
import Typography from 'app/components/Typography'
import { NETWORK_ICON, NETWORK_LABEL } from 'app/config/networks'
import { ChainId } from 'app/constants/extension'
import { classNames } from 'app/functions'
import { useActiveWeb3React } from 'app/services/web3'
import { useModalOpen, useNetworkModalToggle } from 'app/state/application/hooks'
import { ApplicationModal } from 'app/state/application/reducer'
import Image from 'next/image'
import React, { FC } from 'react'

export const SUPPORTED_NETWORKS: Record<
  number,
  {
    chainId: string
    chainName: string
    nativeCurrency: {
      name: string
      symbol: string
      decimals: number
    }
    rpcUrls: string[]
    blockExplorerUrls: string[]
  }
> = {
  [ChainId.ETHEREUM]: {
    chainId: '0x1',
    chainName: 'Ethereum',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://mainnet.infura.io/v3'],
    blockExplorerUrls: ['https://etherscan.com'],
  },
  [ChainId.ARBITRUM]: {
    chainId: '0xA4B1',
    chainName: 'Arbitrum',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://arb1.arbitrum.io/rpc'],
    blockExplorerUrls: ['https://arbiscan.io'],
  },
  [ChainId.ZKSYNC_TESTNET]: {
    chainId: '0x0118',
    chainName: 'ZkSync Testnet',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://testnet.era.zksync.dev'],
    blockExplorerUrls: ['https://goerli.explorer.zksync.io'],
  },
}

const NetworkModal: FC<{ switchNetwork: (targetChain: number) => void }> = ({ switchNetwork }) => {
  const { i18n } = useLingui()
  const { chainId, library, account } = useActiveWeb3React()
  const networkModalOpen = useModalOpen(ApplicationModal.NETWORK)
  const toggleNetworkModal = useNetworkModalToggle()

  if (!chainId) return null

  return (
    <HeadlessUiModal.Controlled isOpen={networkModalOpen} onDismiss={toggleNetworkModal}>
      <div className="flex flex-col gap-4">
        <HeadlessUiModal.Header header={i18n._(t`Select a network`)} onClose={toggleNetworkModal} />
        <div className="grid grid-flow-row-dense grid-cols-1 gap-4 overflow-y-auto md:grid-cols-2">
          {[ChainId.ETHEREUM, ChainId.ARBITRUM, ChainId.ZKSYNC_TESTNET]
            // .sort((key) => (chainId === key ? -1 : 0))
            .map((key: number, i: number) => {
              if (chainId === key) {
                return (
                  <div
                    key={i}
                    className="bg-[rgba(0,0,0,0.2)] focus:outline-none flex items-center gap-4 w-full px-4 py-3 rounded border border-purple cursor-default"
                  >
                    <Image
                      // @ts-ignore TYPE NEEDS FIXING
                      src={NETWORK_ICON[key]}
                      alt="Switch Network"
                      className="rounded-full"
                      width="32px"
                      height="32px"
                    />
                    <Typography weight={700} className="text-high-emphesis">
                      {NETWORK_LABEL[key]}
                    </Typography>
                  </div>
                )
              }
              return (
                <button
                  key={i}
                  onClick={() => switchNetwork(key)}
                  className={classNames(
                    'bg-[rgba(0,0,0,0.2)] focus:outline-none flex items-center gap-4 w-full px-4 py-3 rounded border border-dark-700 hover:border-blue'
                  )}
                >
                  {/*@ts-ignore TYPE NEEDS FIXING*/}
                  <Image
                    src={NETWORK_ICON[key]}
                    alt="Switch Network"
                    className="rounded-full"
                    width="32px"
                    height="32px"
                  />
                  <Typography weight={700} className="text-high-emphesis">
                    {NETWORK_LABEL[key]}
                  </Typography>
                </button>
              )
            })}
        </div>
      </div>
    </HeadlessUiModal.Controlled>
  )
}

export default NetworkModal
