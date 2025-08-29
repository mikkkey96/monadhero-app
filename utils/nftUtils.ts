import { createPublicClient, http } from 'viem';
import { monadTestnet } from 'viem/chains';

// Конфигурация для Monad Testnet
const publicClient = createPublicClient({
  chain: monadTestnet,
  transport: http('https://testnet1.monad.xyz')
});

// ERC-721 ABI для получения информации об NFT
const ERC721_ABI = [
  {
    inputs: [{ name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'owner', type: 'address' }, { name: 'index', type: 'uint256' }],
    name: 'tokenOfOwnerByIndex',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// Популярные NFT контракты на Monad Testnet
const KNOWN_NFT_CONTRACTS = [
  '0x...', // Добавьте адреса известных NFT контraktов
];

export async function getUserNFTs(userAddress: string): Promise<NFT[]> {
  const nfts: NFT[] = [];

  for (const contractAddress of KNOWN_NFT_CONTRACTS) {
    try {
      // Получаем количество NFT у пользователя
      const balance = await publicClient.readContract({
        address: contractAddress as `0x${string}`,
        abi: ERC721_ABI,
        functionName: 'balanceOf',
        args: [userAddress as `0x${string}`],
      });

      // Получаем каждый NFT
      for (let i = 0; i < Number(balance); i++) {
        try {
          const tokenId = await publicClient.readContract({
            address: contractAddress as `0x${string}`,
            abi: ERC721_ABI,
            functionName: 'tokenOfOwnerByIndex',
            args: [userAddress as `0x${string}`, BigInt(i)],
          });

          const tokenUri = await publicClient.readContract({
            address: contractAddress as `0x${string}`,
            abi: ERC721_ABI,
            functionName: 'tokenURI',
            args: [tokenId],
          });

          // Получаем метаданные
          const metadata = await fetchNFTMetadata(tokenUri);
          
          nfts.push({
            tokenId: tokenId.toString(),
            contractAddress,
            metadata,
            tokenUri,
          });
        } catch (error) {
          console.error(`Error fetching NFT ${i} from ${contractAddress}:`, error);
        }
      }
    } catch (error) {
      console.error(`Error fetching balance from ${contractAddress}:`, error);
    }
  }

  return nfts;
}

async function fetchNFTMetadata(tokenUri: string): Promise<NFTMetadata> {
  try {
    // Обработка IPFS ссылок
    let metadataUrl = tokenUri;
    if (tokenUri.startsWith('ipfs://')) {
      metadataUrl = tokenUri.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
    }

    const response = await fetch(metadataUrl);
    const metadata = await response.json();

    // Обработка IPFS ссылок в изображениях
    if (metadata.image && metadata.image.startsWith('ipfs://')) {
      metadata.image = metadata.image.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
    }

    return metadata;
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return {
      name: 'Unknown NFT',
      description: 'Metadata not available',
      image: '',
    };
  }
}
