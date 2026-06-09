// id-nfx: NFX Blockchain Provider (EIP-1193 compatible)
const DEFAULT_RPC = 'http://localhost:27444';

class NFXProvider {
    constructor(config) {
        this.config = config || { rpc: DEFAULT_RPC };
        this.chainId = '0x1';
        this.selectedAddress = null;
        this.accounts = [];
    }

    async rpcCall(method, params = []) {
        const headers = { 'Content-Type': 'application/json' };
        if (this.config.user) {
            headers['Authorization'] = 'Basic ' + btoa(this.config.user + ':' + this.config.password);
        }
        const res = await fetch(this.config.rpc, {
            method: 'POST',
            headers,
            body: JSON.stringify({ jsonrpc: '2.0', id: Date.now(), method, params })
        });
        return res.json()
    }

    async requestAccounts() {
        const result = await this.rpcCall('getnewaddress');
        this.selectedAddress = result.result;
        this.accounts = [this.selectedAddress];
        window.dispatchEvent(new CustomEvent('nfx#accountsChanged', { detail: this.accounts }));
        return this.accounts
    }

    async getBalance(address) {
        const result = await this.rpcCall('getbalance', [address || this.selectedAddress]);
        return result?.result || '0'
    }

    async getinfo() {
        const result = await this.rpcCall('getinfo', []);
        return result?.result
    }

    async sign(message) {
        // O daemon não suporta sign diretamente - precisa wallet unlock
        return this.rpcCall('signmessage', [this.selectedAddress, message]).then(r => r.result)
    }

    async sendTransaction(tx) {
        const result = await this.rpcCall('sendtoaddress', [tx.to, tx.amount, '', '', 1, '', true]);
        return result?.result
    }

    on(event, callback) { window.addEventListener('nfx#' + event, callback); }
    removeListener(event, callback) { window.removeEventListener('nfx#' + event, callback); }
}

export { NFXProvider };
