# SOLICE

A licensing platform that relies on solana to issue

- usage copyrights
- creative copyrights
- standard common licenses

for visual art and photography. (soon for music)

### Problem statement

Validation for copyright issues on media is slow and manual. There isn't a way for artists to know if their content is being used without paying the intended fee back to them. There are many instutions helping with this but that comes with a human middleman. Capable of making errors and hiding things.

### solution

Solice introduces a completely transparent way for everyone to sell, buy and verify licenses issued for a particular media identity. This removes the need of a middleman to manage your issued or bought licenses, it's all decentralised now. Everything is visible to everyone now. With the help of metaplex and solana, solice introduces a completely custom way to license your art.

# Architecture

![image](/draw.png)

## Future expansion

- add multiple options for copyrights from varying time lengths and varying scopes of usage with each option having a minting price of its own
- allowing users to use the same system for audio. This would make much more traction for the common public as resolving a copyright issue for an audio on a platform like youtube would be as simple as proving that "you have the access to one of the wallets that own the nfts from a particular candymachine with some particular settings"
- - This does come with a challenge though. Publishing media on decentralised storage solutions may cost a lot so the audio file would be really compressed. A solution to this might be storing the signature of an audio file on a decentralised storage platform and then comparing to validate the license on a concerned 3rd party platform.
- establish a standard library for verifying digital licenses for media on solana
- allow artists to set up a candymachine with default items. This can be done via hidden settings in a candymachine and allows the artist to manipulate an item's metadata after they have been minted. This would allow for treasury drops for an extended license for a copyright.

# Setting Up Locally

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

# Running Locally

```
npm i
npm run dev
```
