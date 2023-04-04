import { initTRPC } from '@trpc/server';
import { Message } from '../types';
 
const t = initTRPC.create();
 
export type ServerHandlers = {
    submit: (messages: Message[]) => Promise<void>;
}

export const makeServerRouter = (handlers: ServerHandlers) => t.router({
    submit: t.procedure
        .input((val: unknown) => {
            if (typeof val !== 'object') {
                throw new Error('not an array');
            }
            return val as Message[];
        })
        .query(({ input }) => {
            handlers.submit(input);
        })
});

export type ServerRouter = ReturnType<typeof makeServerRouter>;