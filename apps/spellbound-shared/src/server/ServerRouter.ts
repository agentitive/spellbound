import vscode from 'vscode';

import { initTRPC } from '@trpc/server';
 
const t = initTRPC.create();
 
export const serverRouter = t.router({
    popup: t.procedure
        .input((val: unknown) => {
            if (typeof val !== 'string') {
                throw new Error('not a string');
            }
            return val;
        })
        .query(({ input }) => {
            vscode.window.showInformationMessage(input);
        })
});

export type ServerRouter = typeof serverRouter;