import { useEffect, useRef, useState } from 'react';

interface WebSocketMessage {
  event: 'waiting' | 'scan_success' | 'expired';
  message?: string;
  data?: any;
}

export const useWebSocket = (sceneStr: string | null) => {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'closed'>('connecting');
  const [message, setMessage] = useState<string>('');
  const [loginData, setLoginData] = useState<any>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!sceneStr) return;

    const connect = () => {
      const ws = new WebSocket(`ws://127.0.0.1:8889/ws/${sceneStr}`);

      ws.onopen = () => {
        setStatus('connected');
        setMessage('等待扫码...');
      };

      ws.onmessage = (event) => {
        const data: WebSocketMessage = JSON.parse(event.data);
        
        switch(data.event) {
          case 'waiting':
            setMessage(data.message || '等待扫码...');
            break;
          case 'scan_success':
            setMessage('扫码成功！');
            setLoginData(data.data);
            break;
          case 'expired':
            setMessage('二维码已过期，请刷新');
            setStatus('closed');
            break;
        }
      };

      ws.onclose = () => {
        setStatus('closed');
        setMessage('连接已断开');
      };

      ws.onerror = () => {
        setStatus('closed');
        setMessage('连接错误');
      };

      wsRef.current = ws;
    };

    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [sceneStr]);

  return {
    status,
    message,
    loginData,
  };
};