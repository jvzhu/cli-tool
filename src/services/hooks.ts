type HookHandler = (...args: unknown[]) => Promise<void> | void;

type Middleware = <T>(context: T, next: () => Promise<void>) => Promise<void>;

export class Hooks {
  private readonly handlers = new Map<string, HookHandler[]>();

  on(event: string, handler: HookHandler): void {
    const list = this.handlers.get(event) ?? [];
    list.push(handler);
    this.handlers.set(event, list);
  }

  async emit(event: string, ...args: unknown[]): Promise<void> {
    const list = this.handlers.get(event) ?? [];
    for (const handler of list) {
      await handler(...args);
    }
  }
}

export class MiddlewareStack<T extends object> {
  private readonly stack: Middleware[] = [];

  use(middleware: Middleware): void {
    this.stack.push(middleware);
  }

  async run(context: T): Promise<void> {
    let index = -1;

    const dispatch = async (i: number): Promise<void> => {
      if (i <= index) {
        throw new Error('next() called multiple times');
      }
      index = i;
      const fn = this.stack[i];
      if (!fn) {
        return;
      }
      await fn(context, async () => dispatch(i + 1));
    };

    await dispatch(0);
  }
}
