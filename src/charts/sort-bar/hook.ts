import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export interface UseRealtimeOptions<T, nameKey extends TypedKey<T, string>, timeKey extends TypedKey<T, string>> {
  data: T[];
  fields: {
    time: timeKey
    name: nameKey
  };
  interval: number;
}

export type TypedKey<T, V> = string & keyof {
  [P in keyof T as T[P] extends V ? P : never]: any
}

export function useRealtime<T, nameKey extends TypedKey<T, string>, timeKey extends TypedKey<T, string>>({
  data,
  fields: {
    time: timeField,
    name: nameField,
  },
  interval,
}: UseRealtimeOptions<T, nameKey, timeKey>) {
  const [part, setPart] = useState<Record<string, T>>({} as Record<string, T>);
  const currentTime = useRef<T[timeKey]>();
  const currentIndex = useRef(0);

  const sortedNames = useMemo(() => {
    const allNames = data.reduce((nameSet, item) => {
      nameSet.add(item[nameField]);
      return nameSet;
    }, new Set<T[nameKey]>());
    return [...allNames].sort();
  }, [data, nameField]);

  const sortedTimes = useMemo(() => {
    const allTimes = data.reduce((timeSet, item) => {
      timeSet.add(item[timeField]);
      return timeSet;
    }, new Set<T[timeKey]>());
    return [...allTimes].sort();
  }, [data, timeField]);

  const grouped = useMemo(() => {
    return data.reduce((timeMap, item) => {
      const time = item[timeField];
      let old = timeMap.get(time);
      if (!old) {
        old = { time, data: [] };
        timeMap.set(time, old);
      }
      old.data.push(item);
      return timeMap;
    }, new Map<any, { time: any, data: T[] }>());
  }, [data]);

  const multer = useCallback(() => {
    if (currentIndex.current >= sortedTimes.length) {
      return false;
    }
    const current = sortedTimes[currentIndex.current];
    currentTime.current = current;
    const part = grouped.get(current)?.data.reduce((map, item) => {
      map[item[nameField] as unknown as string] = item;
      return map;
    }, {} as Record<string, T>);
    setPart(part ?? {});
    currentIndex.current += 1;
    return currentIndex.current < sortedTimes.length;
  }, [grouped, sortedTimes]);

  useEffect(() => {
    multer();
    const h = setInterval(() => {
      if (!multer()) {
        clearInterval(h);
      }
    }, interval);

    return () => clearInterval(h);
  }, [data, sortedNames, sortedTimes, interval]);

  return { part, sortedNames, sortedTimes, time: currentTime.current };
}