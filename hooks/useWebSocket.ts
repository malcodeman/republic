import React from "react";

import { IsinResponse } from "../types";

const useWebSocket = (url: string) => {
  const [isReady, setIsReady] = React.useState(false);
  const [val, setVal] = React.useState<IsinResponse>();
  const ws = React.useRef<null | WebSocket>(null);
  const readyState = ws.current?.readyState;

  React.useEffect(() => {
    const socket = new WebSocket(url);

    socket.onopen = () => setIsReady(true);
    socket.onclose = () => setIsReady(false);
    socket.onmessage = (event) => setVal(JSON.parse(event.data));

    ws.current = socket;

    return () => {
      socket.close();
    };
  }, [url]);

  const send = (data: string | ArrayBufferLike | Blob | ArrayBufferView) => {
    ws.current?.send(data);
  };

  return { isReady, val, readyState, send };
};

export default useWebSocket;
