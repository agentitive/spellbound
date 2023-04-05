import { CreateTRPCClientOptions, TRPCClientError, TRPCLink, createTRPCProxyClient } from '@trpc/client';
import { observable } from '@trpc/server/observable';
import { TrpcClientRequest, TrpcServerResponse } from './server';
import { MessagePipe } from './MessagePipe';
import { AnyRouter } from '@trpc/server';

export const makeClient = <T extends AnyRouter>(pipe: MessagePipe) => {
  return createTRPCProxyClient<T>({
      links: [(runtime) => {

        return ({ op }) => {
          return observable((observer) => {
            const { id, type, path } = op;

            try {
              const input = runtime.transformer.serialize(op.input);

              const onMessage = (message: TrpcServerResponse) => {
                if (!message) return;
                const trpc = message.trpc;
                if (!trpc) return;
                if (trpc.id === null || trpc.id === undefined) return;
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

              pipe.subscribe((ev) => onMessage(ev.data))

              const message = {
                trpc: {
                  id,
                  jsonrpc: undefined,
                  method: type,
                  params: { path, input },
                },
              } satisfies TrpcClientRequest
              pipe.send(message);
            } catch (cause) {
              console.log(`Error`, cause)
              observer.error(
                new TRPCClientError(cause instanceof Error ? cause.message : 'Unknown error'),
              );
            }

            return () => {

              if (type === 'subscription') {
                pipe.send({
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
    } as CreateTRPCClientOptions<T>
  )
}