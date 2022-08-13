import { Utils } from '@/libs'
import { formatNumber, formatAudString } from 'utils/format'
import ColivingClient from './ColivingClient'
import { Permission, BigNumber } from 'types'
import { fetchWithTimeout } from 'utils/fetch'
import BN from 'bn.js'

// Helpers
export async function hasPermissions(
  this: ColivingClient,
  ...permissions: Array<Permission>
) {
  await this.awaitSetup()
  if (permissions.includes(Permission.WRITE) && !this.hasValidAccount) {
    throw new Error('Libs not configured')
  }
}

export function onSetup(this: ColivingClient) {
  this.isSetupPromise = new Promise(resolve => {
    this._setupPromiseResolve = resolve
  })
}

export function onSetupFinished(this: ColivingClient) {
  if (this._setupPromiseResolve) this._setupPromiseResolve()
}

export async function awaitSetup(this: ColivingClient): Promise<void> {
  return this.isSetupPromise
}

export async function getEthBlockNumber(this: ColivingClient) {
  await this.hasPermissions()
  return this.libs.ethWeb3Manager.web3.eth.getBlockNumber()
}

export async function getEthWallet(this: ColivingClient) {
  await this.hasPermissions()
  return this.libs.ethWeb3Manager.ownerWallet
}

export async function getAverageBlockTime(this: ColivingClient) {
  await this.hasPermissions()
  const web3 = this.libs.ethWeb3Manager.web3
  const span = 1000
  const currentNumber = await web3.eth.getBlockNumber()
  const currentBlock = await web3.eth.getBlock(currentNumber)
  let firstBlock
  try {
    firstBlock = await web3.eth.getBlock(currentNumber - span)
  } catch (e) {
    firstBlock = await web3.eth.getBlock(1)
  }
  return Math.round(
    (currentBlock.timestamp - firstBlock.timestamp) / (span * 1.0)
  )
}

export async function getBlock(this: ColivingClient, blockNumber: number) {
  await this.hasPermissions()
  const web3 = this.libs.ethWeb3Manager.web3
  const block = await web3.eth.getBlock(blockNumber)
  return block
}

export async function getBlockNearTimestamp(
  this: ColivingClient,
  averageBlockTime: number,
  currentBlockNumber: number,
  timestamp: number
) {
  await this.hasPermissions()
  const web3 = this.libs.ethWeb3Manager.web3
  const now = new Date()
  const then = new Date(timestamp)
  // @ts-ignore: date subtraction works
  const seconds = (now - then) / 1000
  const blocks = Math.round(seconds / averageBlockTime)
  const targetNumber = Math.max(currentBlockNumber - blocks, 0)
  const targetBlock = await web3.eth.getBlock(targetNumber)
  return targetBlock
}

export function toChecksumAddress(this: ColivingClient, wallet: string) {
  // NOTE: This is kinda a hack
  // but b/c we load in web3 before the js bundle it will work
  const web3 = window.Web3
  return web3.utils.toChecksumAddress(wallet)
}

// Static Helpers
export function getBNPercentage(
  n1: BigNumber,
  n2: BigNumber,
  decimals: number = 2
): number {
  const divisor = Math.pow(10, decimals + 1)
  if (n2.toString() === '0') return 0
  let num = n1.mul(Utils.toBN(divisor.toString())).div(n2)
  if (num.gte(Utils.toBN(divisor.toString()))) return 1
  return num.toNumber() / divisor
}

export function displayShortAud(amount: BigNumber) {
  return formatNumber(amount.div(Utils.toBN('1000000000000000000') as BN))
}

export function displayAud(amount: BigNumber) {
  return formatAudString(getAud(amount))
}

export function getAud(amount: BigNumber) {
  const aud = amount.div(Utils.toBN('1000000000000000000'))
  const wei = amount.sub(aud.mul(Utils.toBN('1000000000000000000')))
  if (wei.isZero()) {
    return aud.toString()
  }
  const decimals = wei.toString().padStart(18, '0')
  return `${aud}.${trimRightZeros(decimals)}`
}

export function trimRightZeros(number: string) {
  return number.replace(/(\d)0+$/gm, '$1')
}

export function getWei(amount: BigNumber) {
  return amount.mul(Utils.toBN('1000000000000000000'))
}

type NodeMetadata = {
  version: string
  country: string
}

/**
 * @deprecated Replaced with methods below. Can be removed after all nodes update to version 0.3.58
 */
export async function getNodeMetadata(endpoint: string): Promise<NodeMetadata> {
  try {
    const { data } = await fetchWithTimeout(
      `${endpoint}/health_check?verbose=true`
    )
    const { version, country } = data
    return { version, country }
  } catch (e) {
    console.error(e)
    // Return no version if we couldn't find one, so we don't hold everything up
    return { version: '', country: '' }
  }
}

export async function getDiscoveryNodeMetadata(
  endpoint: string
): Promise<NodeMetadata> {
  try {
    const {
      data: { country },
      version: { version }
    } = await fetchWithTimeout(`${endpoint}/location?verbose=true`)
    return { version, country }
  } catch (e) {
    // Try legacy method:
    return await getNodeMetadata(endpoint)
  }
}

export async function getContentNodeMetadata(
  endpoint: string
): Promise<NodeMetadata> {
  try {
    const {
      data: { country, version }
    } = await fetchWithTimeout(`${endpoint}/version`)
    return { version, country }
  } catch (e) {
    // Try legacy method:
    return await getNodeMetadata(endpoint)
  }
}