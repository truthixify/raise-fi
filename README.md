# RaiseFi: A Decentralized Fundraising Platform  
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)  
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/foundry-rs/foundry)  
[![Solidity Version](https://img.shields.io/badge/solidity-^0.8.20-blue)](https://soliditylang.org/)  

**RaiseFi** is a decentralized and transparent fundraising platform on **BNB Smart Chain**. Launch your own time-locked, target-based campaign with no middlemen.  

**Live App** → [raisefi.vercel.app](https://raisefi.vercel.app/)  

---

## 🌟 Features
- ✅ **No Intermediaries** — 100% decentralized  
- ✅ **Target-Based** — Stops at predefined goal  
- ✅ **Time-Locked Vaults** — Funds withdrawable only after deadline  
- ✅ **Creator-Owned** — Only campaign owner can claim funds  

---

## 🛠 Tech Stack
- **Smart Contracts**: Solidity `^0.8.20`
- **Development**: Foundry  
- **Frontend**: Next.js 13 (`/app` folder), Tailwind CSS, Ethers.js  
- **Hosting**: Vercel  

---

## 📂 Project Structure
```
.
├── app/                 # Next.js frontend (UI)
├── contract/                 # Solidity contracts
└── README.md
```

---

## 🚀 Quick Start
### 1. Clone & Install
```bash
git clone https://github.com/truthixify/raise-fi.git
cd contract && forge install
```

### 2. Compile & Test
```bash
forge build
forge test -vvv
```

### 3. Run Frontend
```bash
cd app
npm install
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## 🔐 Security
RaiseFi implements checks-effects-interactions patterns and custom errors for clarity.  
**Not audited yet** — do not use in production without an audit.

---

## 📄 License
MIT License. See [LICENSE](https://opensource.org/licenses/MIT).