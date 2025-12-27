import { QueryClient, isServer } from '@tanstack/react-query';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // SSR では staleTime を設定 (重要！)
        staleTime: 60 * 1000, // 60秒
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (isServer) {
    // Server: 常に新しい QueryClient を作成
    return makeQueryClient();
  } else {
    // Browser: 初回のみ作成、以降は再利用
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
  }
}