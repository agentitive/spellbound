import { initTRPC } from '@trpc/server';
 
const t = initTRPC.create({
    isServer: true,
    allowOutsideOfServer: true,
});

export type ClientHandlers = {
    startMessage: () => Promise<void>;
    updateMessage: (message: string) => Promise<void>;
    finishMessage: () => Promise<void>;
    toolResult: (message: string) => Promise<void>;
}
 
export const makeClientRouter = (handlers: ClientHandlers) => t.router({
    startMessage: t.procedure
        .query(async () => {
            await handlers.startMessage();
        }),
    updateMessage: t.procedure
        .input((val: unknown) => {
            if (typeof val !== 'string') {
                throw new Error('not a string');
            }
            return val
        })
        .query(async ({ input }) => {
            await handlers.updateMessage(input);
        }),
    finishMessage: t.procedure
        .query(async () => {
            await handlers.finishMessage();
        }),
    toolResult: t.procedure
        .input((val: unknown) => {
            if (typeof val !== 'string') {
                throw new Error('not a string');
            }
            return val
        })
        .query(async ({ input }) => {
            await handlers.toolResult(input);
        })
        
});

export type ClientRouter = ReturnType<typeof makeClientRouter>;