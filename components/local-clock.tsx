"use client";

import { useEffect, useState } from "react";

const pad = (value: number) => String(value).padStart(2, "0");

export function LocalClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const timer = setInterval(tick, 30_000);
    return () => clearInterval(timer);
  }, []);

  // 占位保持同宽，避免水合完成后文字出现时把下面内容顶动
  if (!now) return <span className="invisible">0000.00.00 · 00:00</span>;

  const date = `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())}`;
  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

  return (
    <time dateTime={now.toISOString()} title={Intl.DateTimeFormat().resolvedOptions().timeZone}>
      {date} · {time}
    </time>
  );
}
