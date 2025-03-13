import { useEffect } from "react";
import styles from "./App.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store/store";
import {
  fetchAvailableCurrencies,
  setIsModalOpen,
} from "./store/portfolioSlice";
import Modal from "./components/Modal/Modal";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { assets, isLoading, error } = useSelector(
    (state: RootState) => state.portfolio,
  );

  useEffect(() => {
    dispatch(fetchAvailableCurrencies());
  }, [dispatch]);

  return (
    <div>
      <header className={styles.header}>
        <h1>Portfolio Overview</h1>
        <button type="button" onClick={() => dispatch(setIsModalOpen(true))}>
          Добавить
        </button>
      </header>
      {isLoading && <div>Loading...</div>}
      {error && <div>error</div>}
      {assets && assets.length > 0 ? (
        <div>assets</div>
      ) : (
        <div>
          Нет активов в вашем портфеле. Добавьте что-нибудь, чтобы начать!
        </div>
      )}
      <Modal />
    </div>
  );
}

export default App;
