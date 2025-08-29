import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { NFTCard } from './NFTCard';
import { NFTModal } from './NFTModal';
import { getUserNFTs } from '@/utils/nftUtils';

// Определите типы здесь или в отдельном файле types
interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

interface NFT {
  tokenId: string;
  contractAddress: string;
  metadata: NFTMetadata;
  tokenUri: string;
}

export function NFTViewer() {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const { address } = useAccount();

  useEffect(() => {
    if (address) {
      fetchUserNFTs(address);
    }
  }, [address]);

  const fetchUserNFTs = async (userAddress: string) => {
    setLoading(true);
    try {
      // Здесь мы будем получать NFT пользователя
      const userNFTs = await getUserNFTs(userAddress);
      setNfts(userNFTs);
    } catch (error) {
      console.error('Error fetching NFTs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Ваши NFT</h2>
      
      {nfts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">У вас пока нет NFT на Monad Testnet</p>
          <p className="text-sm text-gray-400 mt-2">
            Попробуйте заминтить NFT на{' '}
            <a href="https://magiceden.io/mint-terminal/monad-testnet" 
               className="text-purple-600 hover:underline" 
               target="_blank" 
               rel="noopener noreferrer">
              Magic Eden
            </a>
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nfts.map((nft) => (
            <NFTCard 
              key={`${nft.contractAddress}-${nft.tokenId}`} 
              nft={nft}
              onClick={() => setSelectedNFT(nft)}
            />
          ))}
        </div>
      )}

      {selectedNFT && (
        <NFTModal 
          nft={selectedNFT} 
          onClose={() => setSelectedNFT(null)} 
        />
      )}
    </div>
  );
}
