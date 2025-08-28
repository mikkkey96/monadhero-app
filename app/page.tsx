import { Metadata } from "next";

// Используем стандартный способ получения переменных окружения
const appUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

const frame = {
  version: "next",
  imageUrl: `${appUrl}/images/feed.png`,
  button: {
    title: "Become a Hero 🦸‍♂️",
    action: {
      type: "launch_frame",
      name: "MonadHero - Earn Hero NFT Badges",
      url: appUrl,
      splashImageUrl: `${appUrl}/images/splash.png`,
      splashBackgroundColor: "#7c3aed",
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "MonadHero",
    description: "Earn NFT badges based on your Monad blockchain activity",
    openGraph: {
      title: "MonadHero",
      description: "Earn NFT badges based on your Monad blockchain activity",
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}

// Импортируем компонент приложения
import App from "@/components/pages/app";

export default function Home() {
  return <App />;
}
