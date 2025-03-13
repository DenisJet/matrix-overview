import styles from "./Row.module.scss";
import { Asset, removeAsset } from "../../store/portfolioSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { useWebSocket } from "../../hooks/useWebSocket";

export default function Row({ asset }: { asset: Asset }) {
  const dispatch = useDispatch<AppDispatch>();

  useWebSocket(asset.symbol);

  return (
    <tr
      key={asset.id}
      className={styles.boardRow}
      onClick={() => dispatch(removeAsset(asset.id))}
    >
      <td>{asset.name}</td>
      <td>{asset.quantity}</td>
      <td>$ {asset.currentPrice.toString().replace(/(\..{2}).*/, "$1")}</td>
      <td>$ {asset.purchasePrice}</td>
      <td
        style={{
          color: `${Number(asset.change24h) < 0 ? "red" : "green"}`,
        }}
      >
        {asset.change24h.toString().replace(/(\..{2}).*/, "$1")} %
      </td>
      <td>
        {asset.percentageOfPortfolio.toString().replace(/(\..{2}).*/, "$1")} %
      </td>
    </tr>
  );
}
