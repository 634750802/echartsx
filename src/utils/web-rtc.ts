/*
*  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
*
*  Use of this source code is governed by a BSD-style license
*  that can be found in the LICENSE file in the root of the source
*  tree.
*/

// This code is adapted from
// https://rawgit.com/Miguelao/demos/master/mediarecorder.html

/* globals main, MediaRecorder */

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

function useSupportedType () {
  return  useMemo(() => {
    if (typeof MediaRecorder === 'undefined') {
      return undefined
    }

    const types = [
      "video/webm",
      'video/webm,codecs=vp9',
      'video/vp8',
      "video/webm\;codecs=vp8",
      "video/webm\;codecs=daala",
      "video/webm\;codecs=h264",
      "video/mpeg",
      "video/mp4"
    ];

    for (let i in types) {
      if (MediaRecorder.isTypeSupported(types[i])) {
        return types[i];
      }
    }
  }, [])

}

export function useWebRTCRecorder() {
  const canvasRef = useRef<HTMLCanvasElement>()
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [recording, setRecording] = useState(false);

  const ref = useCallback((canvas: HTMLCanvasElement | null) => {
    canvasRef.current = canvas ?? undefined
    setCanvas(canvas);
    if (canvas) {
      streamRef.current = canvas.captureStream();
      console.log('Started stream capture from canvas element: ', streamRef.current);
    }
  }, []);

  const mediaRecorderRef = useRef<MediaRecorder>();
  const streamRef = useRef<MediaStream>();
  const recordedBlobsRef = useRef<Blob[]>();

  const supportedType = useSupportedType()

  if (!supportedType) {
    throw new Error('Not support recorder')
  }

  console.log(supportedType)

  const start = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return;
    }

    let options = {
      mimeType: supportedType,
      videoBitsPerSecond: 3500000
    };
    recordedBlobsRef.current = [];
    let mediaRecorder: MediaRecorder = new MediaRecorder(streamRef.current!, options);
    mediaRecorder.onstop = event => {
      console.log('Recorder stopped: ', event);
      setRecording(false);
    };
    mediaRecorder.onstart = () => {
      setRecording(true);
    };
    mediaRecorder.ondataavailable = event => {
      if (event.data && event.data.size > 0) {
        recordedBlobsRef.current!.push(event.data);
      }
    }
    mediaRecorder.start(250); // collect 100ms of data
    mediaRecorderRef.current = mediaRecorder;
    console.log('MediaRecorder started', mediaRecorder);
  }, []);

  const stop = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return;
    }
    console.log('MediaRecorder stopped', mediaRecorderRef.current);
    mediaRecorderRef.current?.stop();
  }, []);

  const download = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return;
    }
    const blob = new Blob(recordedBlobsRef.current, { type: supportedType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'test.' + /\w+\/(\w+)/.exec(supportedType || '')?.[1];
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
  }, []);

  useLayoutEffect(() => {
    if (!canvas) {
      return;
    }

    return () => {
      stop();
      canvasRef.current = undefined;
      mediaRecorderRef.current = undefined;
      streamRef.current = undefined;
      recordedBlobsRef.current = undefined;
    };
  }, [canvas]);

  return {
    ref,
    download,
    start,
    stop,
    recording,
  };
}
