"use client";

import { SafeAreaContainer } from "@/components/ui/SafeAreaContainer";
import { useMiniAppContext } from "@/contexts/MiniAppContext";
import MonadHero from "@/components/MonadHero";

export default function Home() {
  const { context } = useMiniAppContext();

  return (
    <SafeAreaContainer insets={context?.client?.safeAreaInsets}>
      <MonadHero />
    </SafeAreaContainer>
  );
}
