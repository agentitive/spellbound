import { AnyRouter, ProcedureType } from '@trpc/server';

import type { NodeHTTPCreateContextOption } from '@trpc/server/dist/adapters/node-http/types';
import type { BaseHandlerOptions } from '@trpc/server/dist/internals/types';

import type {
    TRPCClientOutgoingMessage,
    TRPCErrorResponse,
    TRPCRequest,
    TRPCResultMessage,
} from '@trpc/server/rpc';

export type CreateContextOptions = {
    req: undefined;
    res: undefined;
};

export type RpcServerOptions<TRouter extends AnyRouter> = Pick<
    BaseHandlerOptions<TRouter, CreateContextOptions['req']> &
    NodeHTTPCreateContextOption<
        TRouter,
        CreateContextOptions['req'],
        CreateContextOptions['res']
    >,
    'router' | 'createContext' | 'onError'
>;

export type TrpcClientRequest = {
    trpc: TRPCRequest | TRPCClientOutgoingMessage;
};

export type TrpcSuccessResponse = {
    trpc: TRPCResultMessage<any>;
};

export type TrpcErrorResponse = {
    trpc: TRPCErrorResponse;
};

export type TrpcServerResponse = TrpcSuccessResponse | TrpcErrorResponse;


export type ExecutionContext<TRouter extends AnyRouter> = {
    id: string | number;
    method: ProcedureType | 'subscription.stop'
    params: { path: string, input: any }
    input: any
    rpcContext: any
    serverOptions: RpcServerOptions<TRouter>
    result: any
};