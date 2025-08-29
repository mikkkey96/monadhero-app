import { useState } from 'react';
import { SafeAreaContainer } from '@/components/SafeAreaContainer';
import { useMiniAppContext } from '@/hooks/useMiniAppContext';
import { NFTViewer } from '@/components/NFT/NFTViewer';
import { Demo } from '@/components/Demo';

export default function Home() {
  const { context } = useMiniAppContext();
  const [activeTab, setActiveTab] = useState<'home' | 'nfts'>('home');

  return (
    <SafeAreaContainer insets={context?.client.safeAreaInsets}>
      {/* Навигация */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-100 rounded-full p-1 flex">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-6 py-2 rounded-full transition-colors ${
              activeTab === 'home'
                ? 'bg-white shadow-sm text-purple-600'
                : 'text-gray-600'
            }`}
          >
            Главная
          </button>
          <button
            onClick={() => setActiveTab('nfts')}
            className={`px-6 py-2 rounded-full transition-colors ${
              activeTab === 'nfts'
                ? 'bg-white shadow-sm text-purple-600'
                : 'text-gray-600'
            }`}
          >
            Мои NFT
          </button>
        </div>
      </div>

      {/* Контент */}
      {activeTab === 'home' && <Demo />}
      {activeTab === 'nfts' && <NFTViewer />}
    </SafeAreaContainer>
  );
}
