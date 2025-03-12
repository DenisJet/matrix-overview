import { useEffect } from "react";
import "./App.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store/store";
import { fetchAvailableCurrencies } from "./store/portfolioSlice";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { assets, availableCurrencies, isLoading, error } = useSelector(
    (state: RootState) => state.portfolio,
  );

  useEffect(() => {
    dispatch(fetchAvailableCurrencies());
  }, [dispatch]);

  return (
    <div>
      <header className="header">
        <h1>Portfolio Overview</h1>
        <button type="button">Добавить</button>
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
    </div>
  );
}

export default App;
