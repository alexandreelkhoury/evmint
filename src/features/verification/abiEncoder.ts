import { encodeAbiParameters } from 'viem'

/**
 * ABI encoding utilities for contract verification
 */

/**
 * Generates constructor arguments for MyERC20 contract verification
 * Encodes the constructor parameters according to the contract's ABI
 */
export function encodeConstructorArguments(
  name: string,
  symbol: string,
  initialSupply: bigint,
  decimals: number
): string {
  try {
    const types = [
      { type: 'string', name: 'name' },
      { type: 'string', name: 'symbol' },
      { type: 'uint256', name: 'initialSupply' },
      { type: 'uint8', name: 'decimals' }
    ]

    const values = [name, symbol, initialSupply, decimals]
    const encoded = encodeAbiParameters(types, values)

    // Remove 0x prefix as expected by block explorer APIs
    return encoded.slice(2)
  } catch (error) {
    console.error('Error encoding constructor arguments:', error)
    return ''
  }
}
