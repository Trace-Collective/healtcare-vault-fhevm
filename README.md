# 🏥 Confidential Health Record dApp

Aplikasi web untuk manajemen rekam medis terenkripsi menggunakan teknologi Fully Homomorphic Encryption (FHE) di blockchain.

> ⚠️ **Demo Application**: Aplikasi ini menggunakan enkripsi placeholder untuk tujuan demonstrasi. Implementasi produksi memerlukan Zama FHEVM SDK untuk enkripsi FHE sesungguhnya.

## ✨ Fitur Utama

- 🔐 **Enkripsi End-to-End**: Data kesehatan terenkripsi sebelum disimpan
- 👥 **Kontrol Akses**: Pasien dapat memberikan/mencabut akses dokter
- 🌐 **Bilingual**: Mendukung Bahasa Indonesia dan English
- 🌓 **Dark/Light Mode**: Tema yang dapat disesuaikan
- 💳 **Wallet Integration**: Koneksi wallet untuk autentikasi (demo mode)
- 📱 **Responsive Design**: Optimal di desktop dan mobile

## 🛠 Tech Stack

- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS dengan design system kustom
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Routing**: React Router v6
- **Form Handling**: React Hook Form + Zod (siap digunakan)
- **i18n**: Custom translation system

## 📦 Instalasi

```bash
# Install dependencies
npm install

# Jalankan development server
npm run dev

# Build untuk production
npm run build

# Preview production build
npm run preview
```

## 🚀 Cara Menggunakan

1. **Hubungkan Wallet** (Demo Mode)
   - Klik tombol "Connect Wallet" di navbar
   - Wallet demo akan otomatis terhubung

2. **Buat Rekam Medis**
   - Navigasi ke halaman "Rekam Medis"
   - Klik "Rekam Medis Baru"
   - Isi form dengan data kesehatan
   - Data akan dienkripsi (placeholder) sebelum disimpan

3. **Kelola Akses**
   - Navigasi ke halaman "Kelola Akses"
   - Berikan akses ke alamat dokter
   - Cabut akses kapan saja

4. **Pengaturan**
   - Ganti bahasa (ID/EN)
   - Toggle dark/light mode

## 📁 Struktur Folder

```
src/
├── components/
│   ├── layout/          # Navbar, Sidebar, WalletButton
│   ├── records/         # RecordCard, RecordForm
│   ├── common/          # EmptyState, Loading
│   └── ui/              # shadcn/ui components
├── pages/               # Page components
│   ├── Landing.tsx      # Landing page
│   ├── Dashboard.tsx    # Dashboard
│   ├── Records.tsx      # Records list
│   ├── NewRecord.tsx    # Create record form
│   ├── RecordDetail.tsx # Record detail view
│   ├── Access.tsx       # Access management
│   └── Settings.tsx     # Settings page
├── hooks/               # Custom hooks
│   ├── useRecords.ts    # Records queries/mutations
│   └── useAccess.ts     # Access control hooks
├── services/            # Business logic
│   ├── fhe.ts          # FHE encryption/decryption (placeholder)
│   └── contract.ts     # Contract calls (mock)
├── store/              # Zustand stores
│   ├── authStore.ts    # Auth state
│   └── uiStore.ts      # UI preferences
├── types/              # TypeScript types
│   ├── records.ts      # Health record types
│   └── access.ts       # Access control types
└── lib/                # Utilities
    ├── i18n.ts         # Internationalization
    └── utils.ts        # Helper functions
```

## 🔐 Tentang FHE (Fully Homomorphic Encryption)

FHE memungkinkan komputasi pada data terenkripsi tanpa perlu mendekripsinya terlebih dahulu. Ini berarti:

- Data kesehatan tetap **terenkripsi** di blockchain
- Hanya pihak yang diberi akses dapat **mendekripsi**
- Komputasi dapat dilakukan **tanpa mengungkap data asli**

### Implementasi Saat Ini

- ✅ Arsitektur siap untuk FHE
- ⚠️ Menggunakan base64 encoding sebagai placeholder
- 🔄 Siap untuk integrasi dengan Zama FHEVM SDK

### Migrasi ke FHE Asli

Untuk menghubungkan ke FHEVM sesungguhnya:

1. **Install Zama FHEVM SDK**
   ```bash
   npm install fhevmjs
   ```

2. **Update `src/services/fhe.ts`**
   - Ganti fungsi `encryptData()` dengan FHE encryption
   - Ganti fungsi `decryptData()` dengan FHE decryption

3. **Update `src/services/contract.ts`**
   - Ganti mock contract calls dengan actual contract calls
   - Gunakan wagmi/viem untuk blockchain interaction

4. **Setup Smart Contract**
   - Deploy FHEVM smart contract
   - Update contract address di environment variables

## 🔧 Environment Variables

Buat file `.env` (opsional untuk demo):

```env
VITE_APP_NAME=Confidential Health Record dApp
VITE_DEFAULT_CHAIN_ID=11155111
VITE_RPC_URL=your_rpc_url
VITE_CONTRACT_ADDRESS=your_contract_address
```

## 🎨 Kustomisasi Design System

Design system didefinisikan di `src/index.css` dan `tailwind.config.ts`:

```css
/* index.css */
:root {
  --primary: 200 95% 45%;        /* Medical blue */
  --secondary: 150 60% 50%;      /* Healthy green */
  --gradient-primary: linear-gradient(...);
  /* ... */
}
```

## 📝 Batasan Demo

- ❌ Belum menggunakan FHE encryption sesungguhnya
- ❌ Belum ada smart contract deployment
- ❌ Wallet connection masih mock/placeholder
- ❌ Data hanya disimpan di memory (tidak persisten)

## 🚧 Roadmap

- [ ] Integrasi Zama FHEVM SDK
- [ ] Deploy smart contract ke testnet
- [ ] Integrasi wallet sesungguhnya (MetaMask, WalletConnect)
- [ ] IPFS untuk storage tambahan
- [ ] Role-based access control (Patient/Doctor/Admin)
- [ ] Export/Import encrypted keys
- [ ] Audit trail yang lebih lengkap

## 📚 Dokumentasi Tambahan

- [Zama FHEVM Documentation](https://docs.zama.ai/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

## 🤝 Kontribusi

Untuk kontribusi atau improvement:

1. Fork repository
2. Buat feature branch
3. Commit perubahan
4. Push ke branch
5. Buat Pull Request

## 📄 License

MIT License - Lihat file `LICENSE` untuk detail

## 💡 Tips Pengembangan

1. **State Management**: Gunakan Zustand untuk global state, React Query untuk server state
2. **Styling**: Gunakan design system tokens, hindari inline styles
3. **Components**: Buat komponen kecil dan reusable
4. **Types**: Selalu define TypeScript types untuk data structures
5. **i18n**: Tambahkan translations di `src/lib/i18n.ts`

---

Dibuat dengan ❤️ menggunakan React + TypeScript + TailwindCSS
