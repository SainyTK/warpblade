/** An async iterable fed by `push`, used as the agent's streaming input. It ends after `end`. */
export class MessageQueue<T> implements AsyncIterable<T> {
  private readonly waiting: ((result: IteratorResult<T>) => void)[] = [];
  private readonly queued: T[] = [];
  private ended = false;

  push(value: T): void {
    const next = this.waiting.shift();
    if (next) {
      next({ value, done: false });
    } else {
      this.queued.push(value);
    }
  }

  end(): void {
    this.ended = true;
    for (const next of this.waiting.splice(0)) {
      next({ value: undefined, done: true });
    }
  }

  [Symbol.asyncIterator](): AsyncIterator<T> {
    return {
      next: () => {
        const value = this.queued.shift();
        if (value !== undefined) {
          return Promise.resolve({ value, done: false });
        }
        if (this.ended) {
          return Promise.resolve({ value: undefined, done: true });
        }
        return new Promise((resolve) => this.waiting.push(resolve));
      },
    };
  }
}
