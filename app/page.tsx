import { Metadata } from 'next'
import MonadHero from '@/components/MonadHero'

const appUrl = process.env.NEXT_PUBLIC_URL || 'https://monadhero-app.vercel.app'

// Frame metadata для превью в Farcaster
const frame = {
  version: "1",
  imageUrl: `${appUrl}/api/hero-preview`, // Изображение для превью
  button: {
    title: "Become a Hero 🦸‍♂️", // Кнопка в превью
    action: {
      type: "launch_miniapp",
      name: "MonadHero",
      url: appUrl,
      splashImageUrl: `${appUrl}/api/hero-icon`,
      splashBackgroundColor: "#7c3aed",
    },
  },
}

export const metadata: Metadata = {
  title: 'MonadHero - Blockchain Hero Badges',
  description: 'Analyze your Monad blockchain activity and mint exclusive Hero NFT badges',
  other: {
    'fc:miniapp': JSON.stringify(frame),
    'fc:frame': JSON.stringify(frame), // Для совместимости
  },
}

export default function Home() {
  return <MonadHero />
}
