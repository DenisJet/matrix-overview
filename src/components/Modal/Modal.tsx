import { useDispatch, useSelector } from "react-redux";
import styles from "./Modal.module.scss";
import { AppDispatch, RootState } from "../../store/store";
import { setIsModalOpen } from "../../store/portfolioSlice";

export default function Modal() {
  const dispatch = useDispatch<AppDispatch>();
  const { isModalOpen, availableCurrencies } = useSelector(
    (state: RootState) => state.portfolio,
  );

  return (
    <div
      className={
        isModalOpen ? `${styles.modal} ${styles.active}` : styles.modal
      }
      onClick={() => dispatch(setIsModalOpen(false))}
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
          onClick={() => dispatch(setIsModalOpen(false))}
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
          type="text"
          placeholder="Поиск валюты"
        />
        <ul className={styles.modalAssetsList}>
          {availableCurrencies &&
            availableCurrencies.slice(0, 15).map((item) => {
              return (
                <li key={item.symbol}>
                  <span>{item.symbol.slice(0, -4)}</span>
                  <span>${item.askPrice}</span>
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
      </div>
    </div>
  );
}
