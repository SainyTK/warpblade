/** one spell on Sable's I rotation: what it costs, whether it can go now, how far its recharge has run, and what
 *  happens on the set frame of the casting clip */
export interface SableSpell {
  /** the HUD's name for it */
  label: string;
  mp(): number;
  /** seconds of recharge it starts when cast */
  cooldown(): number;
  /** its recharge left, in seconds */
  left(): number;
  /** start its recharge */
  spend(seconds: number): void;
  /** room for one more on the floor */
  room(): boolean;
  /** it goes off, from her place, on the casting clip's set frame */
  release(): void;
}
