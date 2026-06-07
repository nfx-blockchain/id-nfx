# id-nfx

NFX Blockchain Provider - EIP-1193 compatible for dApps.

## Install

```bash
npm install id-nfx
```

## Quick Start

```javascript
import { NFXProvider } from 'id-nfx';

// Create provider
const provider = new NFXProvider();

// Connect wallet
const accounts = await provider.requestAccounts();
console.log('Connected:', accounts[0]);

// Get balance
const balance = await provider.getBalance(accounts[0]);
console.log('Balance:', balance);
```

## Configuration

Create `.nfxrc.json`:
```json
{
  "rpc": "http://localhost:27444",
  "user": "test",
  "password": "test123"
}
```

Or pass config:
```javascript
const provider = new NFXProvider({
    rpc: 'http://localhost:27444',
    user: 'test',
    password: 'test123'
});
```

## Methods

| Method | Description |
|--------|-------------|
| `requestAccounts()` | Connect wallet, returns addresses |
| `getBalance(address)` | Get NFX balance |
| `getinfo()` | Node info (blocks, connections) |
| `sign(message)` | Sign message |
| `sendTransaction(tx)` | Send transaction |
| `on(event, cb)` | Listen to events |

## Example

```javascript
// Connect
await provider.requestAccounts();

// Get node status
const info = await provider.getinfo();
console.log('Blocks:', info.blocks);

// Listen events
provider.on('accountsChanged', (e) => {
    console.log('Accounts changed:', e.detail[0]);
});
```

## Scripts

```bash
npm run build    # Build UMD/ESM
npm publish    # Publish to npm (when ready)
```