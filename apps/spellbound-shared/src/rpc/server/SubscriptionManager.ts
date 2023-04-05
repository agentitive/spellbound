import { AnyRouter, TRPCError } from "@trpc/server";
import { Observable, Unsubscribable } from "@trpc/server/observable";
import { getErrorFromUnknown } from "./utils";
import { MessagePipe } from "../MessagePipe";
import { ExecutionContext } from "./types";

export class SubscriptionManager<TRouter extends AnyRouter> {
    protected subscriptions: Map<string | number, Unsubscribable>;

    constructor(
        protected router: TRouter,
        protected pipe: MessagePipe
    ) {
        this.subscriptions = new Map<number | string, Unsubscribable>();
    }

    checkDuplicate(sub: any, id: string | number) {
        if (this.subscriptions.has(id)) {
            sub.unsubscribe();
            this.pipe.send({
                result: {
                    type: 'stopped',
                },
            });
            throw new TRPCError({
                message: `Duplicate id ${id}`,
                code: 'BAD_REQUEST',
            });
        }
    }

    start(context: ExecutionContext<TRouter>) {
        const sub = context.result.subscribe({
            next: (data: any) => {
                this.pipe.send({
                    type: 'data',
                    data,
                });
            },
            error: (cause: any) => {
                const error = getErrorFromUnknown(cause);

                this.pipe.send({
                    error: this.router.getErrorShape({
                        error,
                        type: context.method as any,
                        path: context.params?.path,
                        input: context.input,
                        ctx: context.rpcContext,
                    })
                });
            },
            complete: () => {
                this.pipe.send({
                    type: 'stopped',
                });
            }
        });

        this.checkDuplicate(sub, context.id);

        this.subscriptions.set(context.id, sub);

        this.pipe.send({
            result: {
                type: 'started',
            },
        });
    }

    stop(id: string | number) {
        const sub = this.subscriptions.get(id);
        if (sub) {
            sub.unsubscribe();
            this.pipe.send({
                result: {
                    type: 'stopped',
                },
            });
        }
        this.subscriptions.delete(id);
    }


}