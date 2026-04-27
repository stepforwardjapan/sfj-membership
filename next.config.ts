import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  /* config options here */
};

export default withSentryConfig(nextConfig, {
  // ビルド中の Sentry CLI 出力を抑制
  silent: true,
  // ソースマップ自動アップロードは org/project が無い環境でも安全に動くよう
  // 環境変数が揃っていれば有効化、無ければスキップ
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
});
