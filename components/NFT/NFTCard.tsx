import React from 'react';
import Image from 'next/image';

interface NFTCardProps {
  nft: NFT;
  onClick: () => void;
}

export function NFTCard({ nft, onClick }: NFTCardProps) {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/images/nft-placeholder.png';
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden border border-gray-200"
      onClick={onClick}
    >
      <div className="relative aspect-square">
        <Image
          src={nft.metadata.image || '/images/nft-placeholder.png'}
          alt={nft.metadata.name || 'NFT'}
          fill
          className="object-cover"
          onError={handleImageError}
        />
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg truncate">
          {nft.metadata.name || `Token #${nft.tokenId}`}
        </h3>
        
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
          {nft.metadata.description || 'Описание недоступно'}
        </p>
        
        <div className="flex justify-between items-center mt-3">
          <span className="text-xs text-gray-500">
            ID: {nft.tokenId}
          </span>
          <span className="text-xs text-purple-600 font-medium">
            Просмотреть
          </span>
        </div>
      </div>
    </div>
  );
}
