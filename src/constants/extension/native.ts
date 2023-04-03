import { Currency, NATIVE as BASE_NATIVE, NativeCurrency, NativeMap, Token } from '@sushiswap/core-sdk'
import { ChainId } from 'app/constants/extension/index'
import { zkTestNetTokens } from 'app/constants/extension/tokens'
import invariant from 'tiny-invariant'

/**
 * Ether is the main usage of a 'native' currency, i.e. for Ethereum mainnet and all testnets
 */
export class Ether extends NativeCurrency {
  protected constructor(chainId: number) {
    super(chainId, 18, 'ETH', 'Ether')
  }

  public get wrapped(): Token {
    const weth9 = zkTestNetTokens.WETH9
    invariant(!!weth9, 'WRAPPED')
    return weth9
  }

  private static _etherCache: { [chainId: number]: Ether } = {}

  public static onChain(chainId: number): Ether {
    return this._etherCache[chainId] ?? (this._etherCache[chainId] = new Ether(chainId))
  }

  public equals(other: Currency): boolean {
    return other.isNative && other.chainId === this.chainId
  }
}

export const NATIVE: NativeMap = {
  ...BASE_NATIVE,
  [ChainId.ZKSYNC_TESTNET]: Ether.onChain(ChainId.ZKSYNC_TESTNET),
}
