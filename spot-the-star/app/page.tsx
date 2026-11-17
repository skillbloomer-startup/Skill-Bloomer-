import Game from "@/components/game/Game";
import { getIndex, getLessons, getPack, getSourcing, getSponsors, getVolume } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [index, sourcing, lessons, sponsors, volume] = await Promise.all([getIndex(), getSourcing(), getLessons(), getSponsors(), getVolume()]);
  const enabled = index.packs.filter((p) => p.enabled);
  const packs = await Promise.all(enabled.map((p) => getPack(p.id)));
  return (
    <Game
      packs={packs}
      defaultPackId={index.default}
      volume={volume}
      sourcing={sourcing}
      lessons={lessons}
      sponsors={sponsors}
      calendlyUrl={process.env.NEXT_PUBLIC_CALENDLY_URL || ""}
      appUrl={process.env.NEXT_PUBLIC_APP_URL || ""}
    />
  );
}
