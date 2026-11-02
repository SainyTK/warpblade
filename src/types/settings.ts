/** the player's options, kept between visits */
export interface Settings {
  sound: boolean;
  /** 0 to VOLUME_STEPS */
  volume: number;
  shake: boolean;
  damageNumbers: boolean;
}
