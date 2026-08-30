import { default as dayjs } from "dayjs";

export function formatDate(value: number | string) {
  return dayjs(value).format("DD.MM.YYYY HH:mm");
}
