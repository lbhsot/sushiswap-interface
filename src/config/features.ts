import { ChainId } from 'app/constants/extension'
import { Feature } from 'app/enums'

type FeatureMap = { readonly [chainId in ChainId]?: Feature[] }

const features: FeatureMap = {
  [ChainId.ZKSYNC_TESTNET]: [Feature.AMM, Feature.LIQUIDITY_MINING],
  [ChainId.ETHEREUM]: [Feature.AMM, Feature.LIQUIDITY_MINING],
  [ChainId.ROPSTEN]: [Feature.AMM, Feature.LIQUIDITY_MINING, Feature.BENTOBOX, Feature.KASHI, Feature.MISO],
  [ChainId.RINKEBY]: [Feature.AMM, Feature.LIQUIDITY_MINING, Feature.BENTOBOX, Feature.KASHI, Feature.MISO],
  [ChainId.GÖRLI]: [Feature.AMM, Feature.LIQUIDITY_MINING, Feature.BENTOBOX, Feature.KASHI, Feature.MISO],
  [ChainId.KOVAN]: [
    Feature.AMM,
    Feature.LIQUIDITY_MINING,
    Feature.BENTOBOX,
    Feature.KASHI,
    Feature.MISO,
    Feature.TRIDENT,
  ],
  [ChainId.BSC]: [Feature.AMM, Feature.BENTOBOX, Feature.KASHI, Feature.ANALYTICS, Feature.MISO, Feature.SUBGRAPH],
  [ChainId.BSC_TESTNET]: [Feature.AMM],
  [ChainId.FANTOM]: [
    Feature.AMM,
    Feature.ANALYTICS,
    Feature.LIMIT_ORDERS,
    Feature.LIQUIDITY_MINING,
    Feature.BENTOBOX,
    Feature.MISO,
    Feature.SUBGRAPH,
  ],
  [ChainId.FANTOM_TESTNET]: [Feature.AMM],
  [ChainId.MATIC]: [
    Feature.AMM,
    Feature.LIQUIDITY_MINING,
    Feature.BENTOBOX,
    Feature.KASHI,
    Feature.ANALYTICS,
    Feature.LIMIT_ORDERS,
    Feature.TRIDENT,
    Feature.TRIDENT_MIGRATION,
    Feature.MISO,
    Feature.SUBGRAPH,
  ],
  [ChainId.MATIC_TESTNET]: [Feature.AMM],
  [ChainId.HARMONY]: [Feature.AMM, Feature.LIQUIDITY_MINING, Feature.ANALYTICS, Feature.MISO, Feature.SUBGRAPH],
  [ChainId.HARMONY_TESTNET]: [Feature.AMM],
  [ChainId.AVALANCHE]: [
    Feature.AMM,
    Feature.BENTOBOX,
    Feature.KASHI,
    Feature.LIMIT_ORDERS,
    Feature.ANALYTICS,
    Feature.MISO,
    Feature.SUBGRAPH,
  ],
  [ChainId.AVALANCHE_TESTNET]: [Feature.AMM],
  [ChainId.OKEX]: [Feature.AMM],
  [ChainId.OKEX_TESTNET]: [Feature.AMM],
  [ChainId.XDAI]: [
    Feature.AMM,
    Feature.LIQUIDITY_MINING,
    Feature.ANALYTICS,
    Feature.BENTOBOX,
    Feature.KASHI,
    Feature.SUBGRAPH,
  ],
  [ChainId.MOONRIVER]: [Feature.AMM, Feature.LIQUIDITY_MINING, Feature.ANALYTICS, Feature.MISO, Feature.SUBGRAPH],
  [ChainId.CELO]: [Feature.AMM, Feature.LIQUIDITY_MINING, Feature.ANALYTICS, Feature.SUBGRAPH],
  [ChainId.ARBITRUM]: [
    Feature.AMM,
    Feature.LIQUIDITY_MINING,
    Feature.ANALYTICS,
    Feature.BENTOBOX,
    Feature.KASHI,
    Feature.MISO,
    Feature.SUBGRAPH,
  ],
  [ChainId.FUSE]: [Feature.AMM, Feature.LIQUIDITY_MINING, Feature.ANALYTICS, Feature.SUBGRAPH],
  [ChainId.MOONBEAM]: [Feature.AMM, Feature.MISO, Feature.LIQUIDITY_MINING, Feature.SUBGRAPH],
  [ChainId.OPTIMISM]: [Feature.TRIDENT, Feature.BENTOBOX, Feature.SUBGRAPH],
  [ChainId.KAVA]: [Feature.TRIDENT, Feature.BENTOBOX, Feature.LIQUIDITY_MINING, Feature.SUBGRAPH],
  [ChainId.METIS]: [Feature.TRIDENT, Feature.BENTOBOX, Feature.LIQUIDITY_MINING, Feature.SUBGRAPH],
  [ChainId.ARBITRUM_NOVA]: [Feature.AMM],
  [ChainId.BOBA_AVAX]: [Feature.AMM],
}

export default features
