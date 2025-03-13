import { useEffect } from "react";
import styles from "./App.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store/store";
import {
  fetchAvailableCurrencies,
  removeAsset,
  setIsModalOpen,
} from "./store/portfolioSlice";
import Modal from "./components/Modal/Modal";
import Button from "./components/Button/Button";
// import { useWebSocket } from "./hooks/useWebSocket";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { assets, isLoading, error } = useSelector(
    (state: RootState) => state.portfolio,
  );

  useEffect(() => {
    dispatch(fetchAvailableCurrencies());
  }, [dispatch]);

  // useWebSocket(assets[0].symbol);

  return (
    <div className={styles.mainContainer}>
      <header className={styles.header}>
        <h1>Portfolio Overview</h1>
        <Button type="button" onClick={() => dispatch(setIsModalOpen(true))}>
          Добавить
        </Button>
      </header>
      <div className={styles.boardContainer}>
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>error</p>
        ) : assets && assets.length > 0 ? (
          <table className={styles.board}>
            <thead className={styles.boardRow}>
              <tr>
                <td>Актив</td>
                <td>Количество</td>
                <td>Цена</td>
                <td>Общая стоимость</td>
                <td>Изм. за 24 ч.</td>
                <td>% портфеля</td>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => {
                return (
                  <tr
                    className={styles.boardRow}
                    onClick={() => dispatch(removeAsset(asset.id))}
                  >
                    <td>{asset.name}</td>
                    <td>{asset.quantity}</td>
                    <td>
                      ${" "}
                      {asset.currentPrice
                        .toString()
                        .replace(/(\..{2}).*/, "$1")}
                    </td>
                    <td>$ {asset.purchasePrice}</td>
                    <td
                      style={{
                        color: `${
                          Number(asset.change24h) < 0 ? "red" : "green"
                        }`,
                      }}
                    >
                      {asset.change24h.toString().replace(/(\..{2}).*/, "$1")} %
                    </td>
                    <td>
                      {asset.percentageOfPortfolio
                        .toString()
                        .replace(/(\..{2}).*/, "$1")}{" "}
                      %
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p>
            Нет активов в вашем портфеле. Добавьте что-нибудь, чтобы начать!
          </p>
        )}
      </div>
      <Modal />
    </div>
  );
}

export default App;
