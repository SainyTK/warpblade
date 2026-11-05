/** wall seconds since a performance.now() reading, to one decimal */
export const secondsSince = (start: number): number => Math.round((performance.now() - start) / 100) / 10;
