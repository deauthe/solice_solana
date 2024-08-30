# SOLICE

A licensing platform that relies on solana to issue

- usage copyrights
- creative copyrights
- standard common licenses

for visual art and photography. (soon for music)

# Architecture

![image](/draw.png)

# Setting Up

## database

### docker

```
docker run -e POSTGRES_PASSWORD=password -d -p 5432:5432 postgres
```

### provider

any postgres provider like aiven

## nextJs

### env

```
NEXT_PUBLIC_MAINNET_RPC_URL=
NEXT_PUBLIC_DEVNET_RPC_URL=
NEXT_PUBLIC_NFT_STORAGE_KEY=
DATABASE_URL="postgresql://postgres:password@localhost:5432/postgres"
```

# Running

```
npm i
npm run dev
```
