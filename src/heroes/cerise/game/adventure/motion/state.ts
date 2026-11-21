const freshMotion = () => ({
  grace: 0,
  jumpBuffer: 0,
  dashBuffer: 0,
  dashReadyIn: 0,
  wallLock: 0,
  variableRise: false,
  jumpBoost: false,
});

export let motion = freshMotion();

export function resetMotion(): void {
  motion = freshMotion();
}
