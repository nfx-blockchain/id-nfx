(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.NFXProvider = factory();
    }
}(typeof self !== 'undefined' ? self : this, function() {
    'use strict';

    const NFX_RPC = 'http://192.168.131.9:27444'; // WSL testnet RPC
const RPC_AUTH = 'test:test123'; // rpcuser:rpcpassword

    async function rpcCall(method, params = []) {
        try {
            const auth = btoa(RPC_AUTH);
            const res = await fetch(NFX_RPC, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + auth
                },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    id: Date.now(),
                    method,
                    params
                })
            });
            const json = await res.json();
            return json.result;
        } catch (err) {
            console.warn('RPC failed:', err);
            return null;
        }
    }

    class NFXProvider {
        constructor() {
            this.isNFX = true;
            this.chainId = '0x1';
            this.selectedAddress = null;
            this.accounts = [];
            this.keypair = this.generateKeypair();
        }

        generateKeypair() {
            const privateKey = crypto.getRandomValues 
                ? Array.from(crypto.getRandomValues(new Uint8Array(32)))
                    .map(b => b.toString(16).padStart(2, '0')).join('') 
                : '0x' + Math.random().toString(36).slice(2, 70);
            
            const address = 'NFX' + Array(32).fill().map(() => 
                Math.floor(Math.random() * 16).toString(16)
            ).join('').toUpperCase();

            return { privateKey, address };
        }

        async requestAccounts() {
            this.selectedAddress = this.keypair.address;
            this.accounts = [this.selectedAddress];
            
            window.dispatchEvent(new CustomEvent('nfx#accountsChanged', {
                detail: this.accounts
            }));
            
            return this.accounts;
        }

        async getBalance(address) {
            const result = await rpcCall('getbalance', [address || this.selectedAddress]);
            if (result !== null) return '0x' + BigInt(result * 1e8).toString(16);
            const mock = BigInt(Math.floor(Math.random() * 1000 * 1e8));
            return '0x' + mock.toString(16);
        }

        async getinfo() {
            return await rpcCall('getinfo', []);
        }

        async sign(message) {
            return this.keypair.privateKey;
        }

        async sendTransaction(tx) {
            const hash = '0x' + Array(64).fill().map(() => 
                Math.floor(Math.random() * 16).toString(16)
            ).join('');
            return hash;
        }

        on(event, callback) {
            window.addEventListener('nfx#' + event, callback);
        }

        removeListener(event, callback) {
            window.removeEventListener('nfx#' + event, callback);
        }
    }

    if (typeof window !== 'undefined') {
        window.nfx = new NFXProvider();
    }

    return NFXProvider;
}));