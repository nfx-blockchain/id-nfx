export interface NFXConfig {
  rpc?: string
  user?: string
  password?: string
}

export class NFXProvider {
  chainId: string
  selectedAddress: string | null
  accounts: string[]
  
  constructor(config?: NFXConfig)
  requestAccounts(): Promise<string[]>
  getBalance(address?: string): Promise<string>
  getinfo(): Promise<any>
  sign(message: string): Promise<string>
  sendTransaction(tx: any): Promise<string>
  on(event: string, callback: (e: CustomEvent) => void): void
  removeListener(event: string, callback: (e: CustomEvent) => void): void
}