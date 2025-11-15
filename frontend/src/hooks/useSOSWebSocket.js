import { useEffect, useRef, useState } from 'react';

export function useSOSWebSocket(token, onSOSAlert) {
  const [connected, setConnected] = useState(false);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  useEffect(() => {
    if (!token) return;

    const connect = () => {
      try {
        // Use WebSocket (not socket.io) since we're using 'ws' library on server
        const wsUrl = `ws://localhost:5001/ws/sos?token=${token}`;
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          console.log('SOS WebSocket connected');
          setConnected(true);
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
          }
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            if (data.type === 'SOS_ALERT') {
              console.log('SOS Alert received:', data);
              if (onSOSAlert) {
                onSOSAlert(data);
              }
            } else if (data.type === 'connected') {
              console.log('WebSocket:', data.message);
            } else if (data.type === 'pong') {
              // Keepalive response
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          setConnected(false);
        };

        ws.onclose = () => {
          console.log('SOS WebSocket disconnected');
          setConnected(false);
          
          // Attempt to reconnect after 3 seconds
          if (!reconnectTimeoutRef.current) {
            reconnectTimeoutRef.current = setTimeout(() => {
              reconnectTimeoutRef.current = null;
              connect();
            }, 3000);
          }
        };

        wsRef.current = ws;

        // Send ping every 30 seconds to keep connection alive
        const pingInterval = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'ping' }));
          }
        }, 30000);

        return () => {
          clearInterval(pingInterval);
        };
      } catch (error) {
        console.error('WebSocket connection error:', error);
        setConnected(false);
      }
    };

    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [token, onSOSAlert]);

  return { connected };
}


