import { useWebRTCRecorder } from '/src/utils/web-rtc';
import { EChartsType } from 'echarts/types/dist/shared';
import { ForwardedRef, RefCallback, useCallback } from 'react';

export function withEChartsRecorder (echarts: ForwardedRef<EChartsType>) {
  const { start, stop, recording, download, ref: canvasRef } = useWebRTCRecorder()
  const ref: RefCallback<EChartsType> = useCallback((ec) => {
    canvasRef(ec?.getDom().querySelector('canvas') ?? null)
  }, [])

  return { ref, start, stop, recording, download }
}