import { init, use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { EChartsOption } from 'echarts/types/dist/shared';
import { LocaleOption } from 'echarts/types/src/core/locale';
import { ComponentOption as EChartsComponentOption, RendererType } from 'echarts/types/src/util/types';
import deepEqual from 'fast-deep-equal/react';
import React, {
  createContext,
  HTMLAttributes,
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';


export interface OptionProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  theme?: string | object;
  init?: {
    locale?: string | LocaleOption;
    renderer?: RendererType;
    devicePixelRatio?: number;
    useDirtyRect?: boolean;
    ssr?: boolean;
    width?: number;
    height?: number;
  };
  defaults?: Partial<EChartsOption>;
}

function addComponent(option: EChartsOption, item: EChartsComponentOption) {
  if (!item.mainType) {
    throw new Error('option.mainType must be specified');
  }
  if (option[item.mainType]) {
    const optionItem = option[item.mainType] as EChartsComponentOption | EChartsComponentOption[];
    if (optionItem instanceof Array) {
      if (optionItem.length === 1) {
        if (optionItem[0].id === item.id && item.id !== undefined) {
          optionItem[0] = item;
        } else if (optionItem[0].id === undefined || item.id === undefined) {
          throw new Error('option.id must be set with multiple items');
        } else {
          optionItem.push(item);
        }
      } else if (optionItem.length > 1) {
        if (item.id === undefined) {
          throw new Error('option.id must be set with multiple items');
        }
        const idx = optionItem.findIndex(i => i.id === item.id);
        if (idx >= 0) {
          optionItem.splice(idx, 1, item);
        } else {
          optionItem.push(item);
        }
      } else {
        optionItem[0] = item;
      }
    } else {
      if (optionItem.id === item.id && item.id !== undefined) {
        option[item.mainType] = item;
      } else if (item.id === undefined || optionItem.id === undefined) {
        throw new Error('option.id must be set with multiple items');
      } else {
        option[item.mainType] = [optionItem, item];
      }
    }
  } else {
    option[item.mainType] = item;
  }
}

export const OptionContext = createContext<{
  set(id: string, component: EChartsComponentOption): void
  remove(id: string): void
  markNoMerge(): void
}>({
  set() {
  },
  markNoMerge() {
  },
  remove() {
  },
});

OptionContext.displayName = 'EChartsxContext';

use(CanvasRenderer);

export default function EChartsx({ children, theme, init: initProp, defaults = {}, ...props }: OptionProps) {
  const options = useMemo<Record<string, EChartsComponentOption>>(() => ({}), []);
  const ref = useRef<HTMLDivElement>(null);
  const echartsInstanceRef = useRef<ReturnType<typeof init>>();
  const [version, setVersion] = useState(0);
  const shouldFullReload = useRef(true);
  const changingKeys = useRef<Record<string, boolean>>({});

  const set = useCallback((id: string, component: EChartsComponentOption) => {
    if (deepEqual(options[id], component)) {
      return;
    }
    options[id] = component;
    changingKeys.current[id] = true;
    setVersion(version => version + 1);
  }, []);

  const remove = useCallback((id: string) => {
    if (!(id in options)) {
      return;
    }
    delete options[id];
    shouldFullReload.current = true;
    changingKeys.current[id] = true;
    setVersion(version => version + 1);

  }, []);

  const markNoMerge = useCallback(() => {
    shouldFullReload.current = true
  }, [])

  useLayoutEffect(() => {
    if (ref.current) {
      echartsInstanceRef.current = init(ref.current, theme, initProp);
    } else {
      echartsInstanceRef.current?.dispose();
      echartsInstanceRef.current = undefined;
    }
    return () => {
      echartsInstanceRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    const option: EChartsOption = shouldFullReload.current ? { ...defaults } : {};
    (shouldFullReload.current ? Object.values(options) : Object.keys(changingKeys.current).map(key => options[key]))
      .forEach(component => addComponent(option, component));
    if (Object.keys(option).length) {
      echartsInstanceRef.current?.setOption(option, shouldFullReload.current);
    }
    shouldFullReload.current = false;
    changingKeys.current = {};
  }, [defaults, version]);

  return (
    <OptionContext.Provider value={{ set, markNoMerge, remove }}>
      <div ref={ref} {...props} />
      {children}
    </OptionContext.Provider>
  );
}
