import { ChainId } from 'app/constants/extension'
import { SWRConfiguration } from 'swr'

export interface GraphProps {
  chainId?: ChainId
  variables?: { [key: string]: any }
  shouldFetch?: boolean
  swrConfig?: SWRConfiguration
}
