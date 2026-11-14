declare module "../../../types/skillBehavior" {
  interface SkillEvents {
    /** Saya's blade went home and released the cuts stored in `foes` foes; `full` a keyed sheathe, `keen` a clean one */
    release: { foes: number; full: boolean; keen: boolean };
  }
}

export {};
