import type { MeasureSample } from "../types";
import { PHONE_VIEWPORTS } from "./constants";
import { wantsAny } from "./planShots";
import { bossScene } from "./scenes/bossScene";
import { menusScene } from "./scenes/menusScene";
import { phoneScene } from "./scenes/phoneScene";
import { pickScene } from "./scenes/pickScene";
import { stageScene } from "./scenes/stageScene";
import { surgeScene } from "./scenes/surgeScene";
import type { Scene, SceneSubject, ShotPlan } from "./types";

export function buildScenes(plan: ShotPlan, sample: MeasureSample): Scene[] {
  const [firstHero] = sample.heroes;
  const [firstStage] = sample.stages;
  if (!firstHero || !firstStage) {
    return [];
  }
  const lead: SceneSubject = { hero: firstHero, stage: firstStage, lead: true, plan };
  const subjects: SceneSubject[] = sample.heroes.flatMap((hero) =>
    sample.stages.map((stage) => ({ hero, stage, lead: hero === firstHero && stage === firstStage, plan })),
  );
  const scenes: Scene[] = [];
  if (wantsAny(plan, ["menuStart", "menuHeroes", "menuStage"])) {
    scenes.push(menusScene(lead));
  }
  if (plan.has("pick")) {
    scenes.push(pickScene(lead));
  }
  for (const subject of subjects) {
    if (wantsAny(plan, ["start", "fight"]) || (subject.lead && wantsAny(plan, ["combatClip", "hitClip"]))) {
      scenes.push(stageScene(subject));
    }
    if (plan.has("surge")) {
      scenes.push(surgeScene(subject));
    }
    const leadBoss = subject.lead && wantsAny(plan, ["bossAttackClip", "chargeClip", "result"]);
    if (wantsAny(plan, ["bossArrival", "bossFight"]) || leadBoss) {
      scenes.push(bossScene(subject));
    }
  }
  if (plan.has("phone")) {
    scenes.push(...PHONE_VIEWPORTS.map((viewport) => phoneScene(lead, viewport)));
  }
  return scenes;
}
