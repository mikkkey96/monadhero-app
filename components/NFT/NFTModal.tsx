import React from 'react';
import Image from 'next/image';

interface NFTModalProps {
  nft: NFT;
  onClose: () => void;
}

export function NFTModal({ nft, onClose }: NFTModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {nft.metadata.name || `Token #${nft.tokenId}`}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        
        <div className="p-6">
          <div className="aspect-square relative mb-6 rounded-lg overflow-hidden">
            <Image
              src={nft.metadata.image || '/images/nft-placeholder.png'}
              alt={nft.metadata.name || 'NFT'}
              fill
              className="object-cover"
            />
          </div>
          
          {nft.metadata.description && (
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2">Описание</h3>
              <p className="text-gray-600">{nft.metadata.description}</p>
            </div>
          )}
          
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2">Детали</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Token ID:</span>
                <span className="font-mono">{nft.tokenId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Контракт:</span>
                <span className="font-mono text-sm">{nft.contractAddress}</span>
              </div>
            </div>
          </div>
          
          {nft.metadata.attributes && nft.metadata.attributes.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Атрибуты</h3>
              <div className="grid grid-cols-2 gap-3">
                {nft.metadata.attributes.map((attr, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600">{attr.trait_type}</div>
                    <div className="font-medium">{attr.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
