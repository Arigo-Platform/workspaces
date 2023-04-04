export default function GetRelativeTime(d1: Date, d2 = new Date()): string {
  const diff = d1.getTime() - d2.getTime();

  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  let relativeTime: string;
  if (seconds < 60) {
    relativeTime = formatter.format(seconds, "second");
  } else if (minutes < 60) {
    relativeTime = formatter.format(minutes, "minute");
  } else if (hours < 24) {
    relativeTime = formatter.format(hours, "hour");
  } else {
    relativeTime = formatter.format(days, "day");
  }

  return relativeTime;
}
