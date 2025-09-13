import { NextResponse } from "next/server";
import { APP_URL } from "../../../lib/constants";

export async function GET() {
  const farcasterConfig = {
    frame: {
      version: "1",
      name: "MonadHero",
      iconUrl: `${APP_URL}/images/icon.png`,
      homeUrl: `${APP_URL}`,
      imageUrl: `${APP_URL}/images/feed-new.png`,
      subtitle: "Monad Score",
      description: "Analyze your Monad blockchain activity and mint Hero NFT badges",
      buttonTitle: "Become a Hero 🚀",
      splashImageUrl: `${APP_URL}/images/splash-new.png`,
      splashBackgroundColor: "#A020F0",
      webhookUrl: `${APP_URL}/api/webhook`,
      primaryCategory: "finance",
      tags: ["monad", "blockchain", "nft", "defi"]
    },
    accountAssociation: {
      header: "eyJmaWQiOjU2NjA0MywidHlwZSI6ImF1dGgiLCJrZXkiOiIweDkyQmIyZGE0ODU3MTgwMENlZDI3NDkzNGFFODQ2ZjY1ZDFFMDZiZjUifQ",
      payload: "eyJkb21haW4iOiJtb25hZGhlcm8tYXBwLnZlcmNlbC5hcHAifQ",
      signature: "6y7hlrDAM0A9/2Zyt5+VoWBtvG/5LoYJOeq55Lt8tIxGHVYme1bUzu54eT7rbf1N87Z86puzppLtjBcW3h53rxs="
    }
  };

  return NextResponse.
