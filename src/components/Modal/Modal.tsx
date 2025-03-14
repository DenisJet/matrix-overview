import { useDispatch, useSelector } from "react-redux";
import styles from "./Modal.module.scss";
import { AppDispatch, RootState } from "../../store/store";
import { addAsset, Currency, setIsModalOpen } from "../../store/portfolioSlice";
import { useEffect, useState } from "react";
import Button from "../Button/Button";
import { v4 } from "uuid";

export default function Modal() {
  const dispatch = useDispatch<AppDispatch>();
  const { isModalOpen, availableCurrencies } = useSelector(
    (state: RootState) => state.portfolio,
  );
  const [searchValue, setSearchValue] = useState<string>("");
  const [filteredCurrencies, setFilteredCurrencies] = useState<Currency[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(
    null,
  );
  const [quantity, setQuantity] = useState<string>("");

  useEffect(() => {
    setFilteredCurrencies(availableCurrencies.slice(0, 15));
  }, [availableCurrencies]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    setFilteredCurrencies(
      availableCurrencies.filter((item: Currency) =>
        item.symbol.toLowerCase().startsWith(value.toLowerCase()),
      ),
    );
  };

  const handleModalClose = () => {
    dispatch(setIsModalOpen(false));
    setFilteredCurrencies(availableCurrencies.slice(0, 15));
    setSelectedCurrency(null);
    setSearchValue("");
    setQuantity("");
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedCurrency && Number(quantity) > 0) {
      dispatch(
        addAsset({
          id: v4(),
          name: selectedCurrency.symbol.slice(0, -4),
          symbol: selectedCurrency.symbol,
          quantity: Number(quantity),
          currentPrice: selectedCurrency.askPrice,
          change24h: selectedCurrency.priceChangePercent,
        }),
      );
      handleModalClose();
    }
  };

  return (
    <div
      className={
        isModalOpen ? `${styles.modal} ${styles.active}` : styles.modal
      }
      onClick={handleModalClose}
    >
      <div
        className={
          isModalOpen
            ? `${styles.modalContent} ${styles.active}`
            : styles.modalContent
        }
        onClick={(evt) => evt.stopPropagation()}
      >
        <button
          type="button"
          title="Закрыть"
          className={styles.button}
          onClick={handleModalClose}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.11 2.697L2.698 4.11 6.586 8l-3.89 3.89 1.415 1.413L8 9.414l3.89 3.89 1.413-1.415L9.414 8l3.89-3.89-1.415-1.413L8 6.586l-3.89-3.89z"
            ></path>
          </svg>
        </button>

        <input
          className={styles.modalInput}
          onChange={handleInputChange}
          value={searchValue}
          type="text"
          placeholder="Поиск валюты"
        />
        <ul className={styles.modalAssetsList}>
          {filteredCurrencies &&
            filteredCurrencies.slice(0, 15).map((item) => {
              return (
                <li key={item.symbol} onClick={() => setSelectedCurrency(item)}>
                  <span>{item.symbol.slice(0, -4)}</span>
                  <span>
                    ${item.askPrice.toString().replace(/(\..{2}).*/, "$1")}
                  </span>
                  <span
                    style={{
                      color: `${
                        Number(item.priceChangePercent) < 0 ? "red" : "green"
                      }`,
                    }}
                  >
                    {item.priceChangePercent.slice(0, 4)}%
                  </span>
                </li>
              );
            })}
        </ul>
        {selectedCurrency && (
          <form className={styles.form} onSubmit={handleSubmit}>
            <p>
              {selectedCurrency.symbol.slice(0, -4)} {selectedCurrency.askPrice}
            </p>
            <input
              value={quantity}
              onChange={handleQuantityChange}
              type="number"
              placeholder="Количество"
              required
              min="1"
            />
            <div className={styles.formButtons}>
              <Button type="submit">Добавить</Button>
              <Button type="button" onClick={handleModalClose}>
                Отмена
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
