import { AnyProcedure, AnyRouter } from "@trpc/server";
import { TRPCRequest, TRPCClientOutgoingMessage } from "@trpc/server/rpc";

import { MessagePipe } from "./MessagePipe";
import { SubscriptionManager } from "./SubscriptionManager";
import { TrpcClientRequest, RpcServerOptions, TrpcServerResponse, ExecutionContext } from "./types";


const extractRequest = (message: TrpcClientRequest): (TRPCRequest | TRPCClientOutgoingMessage) | null => {
    if (!('trpc' in message)) {
        return null;
    }

    const { trpc } = message;

    if (!trpc || trpc.id === undefined || trpc.id === null) {
        return null;
    }

    return trpc;
};

export class Server<TRouter extends AnyRouter> {
    protected options: RpcServerOptions<TRouter>;
    protected pipe: MessagePipe;
    protected subs: SubscriptionManager<TRouter>;

    constructor(pipe: MessagePipe, options: RpcServerOptions<TRouter>) {
        this.options = options;
        this.pipe = pipe
        this.pipe.subscribe(this.onMessage.bind(this));
        this.subs = new SubscriptionManager(this.options.router, this.pipe);
    }

    get router() { return this.options.router; }
    get createContext() { return this.options.createContext; }
    get onError() { return this.options.onError; }
    get transformer() { return this.router._def._config.transformer; }

    sendResponse(request: TrpcClientRequest, response: TrpcServerResponse['trpc']) {
        const { id, jsonrpc } = request.trpc;
        this.pipe.send({
            trpc: {
                ...request.trpc,
                ...response
            },
        });
    };

    async onMessage(message: TrpcClientRequest) {
        const request = extractRequest(message);

        if (!request) {
            return;
        }

        if ('params' in request) {
            const context = await this.execute(request);
            switch (request.method as ExecutionContext<TRouter>["method"]) {
                case 'subscription.stop':
                    this.subs.stop(request.id!);
                    break;
                case 'subscription':
                    this.subs.start(context);
                    break;
                default:
                    this.sendResponse(message, {
                        result: {
                            type: 'data',
                            data: this.transformer.output.serialize(context.result),
                        }
                    });
                    break;
            }
        }

    }

    async execute(request: TRPCRequest): Promise<ExecutionContext<TRouter>> {
        const params = request.params;
        const input = this.transformer.input.deserialize(params.input);
        const ctx = await this.createContext?.({ req: undefined, res: undefined });
        const caller = this.router.createCaller(ctx);
        const segments = params.path.split('.');
        const procedureFn = segments.reduce(
            (acc, segment) => acc[segment],
            caller as any,
        ) as AnyProcedure;

        const result = await procedureFn(input);

        return {
            id: request.id!,
            method: request.method,
            params,
            input,
            rpcContext: ctx,
            serverOptions: this.options,
            result
        };
    }

}