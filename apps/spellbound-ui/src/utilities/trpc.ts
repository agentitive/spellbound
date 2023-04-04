import { TRPCClientError, TRPCLink, createTRPCProxyClient } from '@trpc/client';
import { observable } from '@trpc/server/observable';
import { TrpcServerResponse, TrpcClientRequest, ServerRouter } from 'spellbound-shared';
import { vscode } from './vscode';


export const makeClient = () => {
  return createTRPCProxyClient<ServerRouter>({
    links: [(runtime) => {

      return ({ op }) => {
        return observable((observer) => {
          const { id, type, path } = op;

          try {
            const input = runtime.transformer.serialize(op.input);

            const onMessage = (message: TrpcServerResponse) => {
              if (!('trpc' in message)) return;
              const { trpc } = message;
              if (!trpc) return;
              if (!('id' in trpc) || trpc.id === null || trpc.id === undefined) return;
              if (id !== trpc.id) return;

              if ('error' in trpc) {
                const error = runtime.transformer.deserialize(trpc.error);
                observer.error(TRPCClientError.from({ ...trpc, error }));
                return;
              }

              observer.next({
                result: {
                  ...trpc.result,
                  ...((!trpc.result.type || trpc.result.type === 'data') && {
                    type: 'data',
                    data: runtime.transformer.deserialize(trpc.result.data),
                  }),
                } as any,
              });

              if (type !== 'subscription' || trpc.result.type === 'stopped') {
                observer.complete();
              }
            };

            window.addEventListener('message', (ev) => onMessage(ev.data));

            const message = {
              trpc: {
                id,
                jsonrpc: undefined,
                method: type,
                params: { path, input },
              },
            } as TrpcClientRequest
            console.log(`Posting message`, message)
            vscode.postMessage(message);
          } catch (cause) {
            console.log(`Error`, cause)
            observer.error(
              new TRPCClientError(cause instanceof Error ? cause.message : 'Unknown error'),
            );
          }

          return () => {

            if (type === 'subscription') {
              vscode.postMessage({
                trpc: {
                  id,
                  jsonrpc: undefined,
                  method: 'subscription.stop',
                },
              } as TrpcClientRequest);
            }
          };
        });
      };
    }],
  })
}