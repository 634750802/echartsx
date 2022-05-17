import { TypedKey } from '/src/charts/sort-bar/hook';
import { useMemo } from 'react';

export interface UseRankProps<T> {
  data: T[];
  fields: {
    name: TypedKey<T, string>
  };
}

export function useRank<T> ({ data, fields }: UseRankProps<T>) {
  const groups = useMemo(() => {
    return data.reduce((record, item) => {
      let old = record[item[fields.name] as any]
      if (!old) {
        old = record[item[fields.name] as any] = []
      }
      old.push(item)
      return record
    }, {} as Record<string, T[]>)
  }, [data, fields.name])

  return groups
}