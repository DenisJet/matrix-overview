import { useEffect } from "react";
import { useDispatch } from "react-redux";
// import { updateAssetPrice } from "../store/assetsSlice";

export const useWebSocket = (symbol: string) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const ws = new WebSocket(
      `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@ticker`,
    );

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
      // const { s: symbol, c: price, P: change24h } = data;
      // dispatch(
      //   updateAssetPrice({
      //     id: symbol,
      //     price: parseFloat(price),
      //     change24h: parseFloat(change24h),
      //   }),
      // );
    };

    return () => {
      ws.close();
    };
  }, [symbol, dispatch]);
};
