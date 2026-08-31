import prettyBytes from "pretty-bytes";

export function formatBytes(value: number | bigint) {
  return prettyBytes(value, { binary: true });
}
