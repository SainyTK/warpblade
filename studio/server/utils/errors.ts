/** A request the studio refuses, with the HTTP status to answer. */
export class StudioError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}
