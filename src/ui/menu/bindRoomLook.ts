import { character, chooseCharacter } from "../../game/state";
import { inRoom, onRoomChange } from "../../store/coop";
import { chosenJob } from "../../store/jobs";

/** a room plays every hero in their own job: the hero behind the menus wears it from the moment a room is hosted or
 *  joined, and puts the solo job choice back on when the room is left or fails */
export function bindRoomLook(): void {
  let wasInRoom = inRoom();
  onRoomChange(() => {
    const now = inRoom();
    if (now === wasInRoom) return;
    wasInRoom = now;
    chooseCharacter(character, now ? null : chosenJob(character.id));
  });
}
