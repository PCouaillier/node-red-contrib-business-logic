type CommandHandler = (eventName: string, data: any) => any;

export class CommandBus {
    private handlers: Map<string, CommandHandler[]> = new Map();
    private defaultHandler?: CommandHandler;

    public addEventHandler(eventName: string, callable: CommandHandler) {
        if (!this.handlers.has(eventName)) {
            this.handlers.set(eventName, [callable]);
        } else {
            this.handlers.get(eventName)?.push(callable);
        }
    }

    public setDefaultHandler(handler: CommandHandler) {
        this.defaultHandler = handler;
    }

    public async handleEvent(eventName: string, data: any) {
        const handlers = this.handlers.get(eventName);
        if (handlers === undefined || handlers.length === 0) {
            if (this.defaultHandler) {
                return await this.defaultHandler(eventName, data)
            }
            return;
        }
        return await Promise.resolve(handlers.map(handler => handler(eventName, data)));
    }

    public getEventHandler() {
        return (event: string, data: any) => this.handleEvent(event, data);
    }
}
