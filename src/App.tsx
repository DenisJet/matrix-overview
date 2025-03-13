import { useEffect } from "react";
import styles from "./App.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store/store";
import {
  fetchAvailableCurrencies,
  setIsModalOpen,
} from "./store/portfolioSlice";
import Modal from "./components/Modal/Modal";
import Button from "./components/Button/Button";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { assets, isLoading, error } = useSelector(
    (state: RootState) => state.portfolio,
  );

  useEffect(() => {
    dispatch(fetchAvailableCurrencies());
  }, [dispatch]);

  return (
    <div className={styles.mainContainer}>
      <header className={styles.header}>
        <h1>Portfolio Overview</h1>
        <Button type="button" onClick={() => dispatch(setIsModalOpen(true))}>
          Добавить
        </Button>
      </header>
      <div className={styles.board}>
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>error</p>
        ) : assets && assets.length > 0 ? (
          <p>assets</p>
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
