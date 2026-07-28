import { Link, useNavigate } from 'react-router';
import { Button } from '../../components/Button/Button';
import { useSpreadsheets } from './useSpreadsheets';
import './SpreadsheetsPage.css';

export function SpreadsheetsPage() {
  const navigate = useNavigate();
  const { items, create, clear } = useSpreadsheets();

  const handleCreate = () => {
    const meta = create();
    navigate(`/spreadsheets/${meta.id}`);
  };

  const handleClearAll = () => {
    if (window.confirm('Удалить все таблицы? Действие необратимо.')) {
      clear();
    }
  };

  return (
    <div className="spreadsheets">
      <div className="spreadsheets__header">
        <h1 className="spreadsheets__title">Таблицы</h1>

        <div className="spreadsheets__actions">
          {items.length > 0 && (
            <Button variant="default" size="sm" onClick={handleClearAll} type="button">
              Очистить список
            </Button>
          )}

          <Button variant="accent" size="sm" onClick={handleCreate} type="button">
            Создать таблицу
          </Button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="spreadsheets__empty">
          <p>Пока нет ни одной таблицы.</p>
        </div>
      ) : (
        <ul className="spreadsheets__list">
          {items.map((s) => (
            <li key={s.id} className="spreadsheets__item">
              <Link to={`/spreadsheets/${s.id}`} className="spreadsheets__link">
                <span className="spreadsheets__icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <line x1="3" y1="9" x2="21" y2="9" />
                    <line x1="3" y1="15" x2="21" y2="15" />
                    <line x1="9" y1="3" x2="9" y2="21" />
                    <line x1="15" y1="3" x2="15" y2="21" />
                  </svg>
                </span>

                <span className="spreadsheets__name">{s.title}</span>
                <span className="spreadsheets__time">{formatRelative(s.createdAt)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function formatRelative(ts: number): string {
  const diff = Date.now() - ts;
  const min = 60_000;
  const hour = 60 * min;
  const day = 24 * hour;

  if (diff < min) return 'только что';
  if (diff < hour) return `${Math.floor(diff / min)} мин назад`;
  if (diff < day) return `${Math.floor(diff / hour)} ч назад`;
  if (diff < 7 * day) return `${Math.floor(diff / day)} дн назад`;

  return new Date(ts).toLocaleDateString('ru-RU');
}
