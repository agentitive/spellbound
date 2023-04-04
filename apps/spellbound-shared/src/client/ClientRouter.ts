import vscode from 'vscode';

import { initTRPC } from '@trpc/server';
 
const t = initTRPC.create();

export type ClientHandlers = {
    debugMsg: (msg: string) => Promise<void>;
}
 
export const makeClientRouter = (handlers: ClientHandlers) => t.router({
    popup: t.procedure
        .input((val: unknown) => {
            if (typeof val !== 'string') {
                throw new Error('not a string');
            }
            return val;
        })
        .query(async ({ input }) => {
            await handlers.debugMsg(input);
        })
});

export type ClientRouter = ReturnType<typeof makeClientRouter>;