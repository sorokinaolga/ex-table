import { Link } from 'react-router';
import './SpreadsheetsPage.css';

interface Spreadsheet {
  id: string;
  title: string;
  owner: string;
  updatedAt: string;
}

const SPREADSHEETS: Spreadsheet[] = [
  { id: '1', title: 'Видео Cloud', owner: 'Елена Иванова', updatedAt: '15:42' },
  { id: '2', title: 'Хендовер (Копия)', owner: 'Юрий Киров', updatedAt: '17:07' },
  { id: '3', title: 'Ежемесячный отчет', owner: 'я', updatedAt: '10:49' },
  { id: '4', title: 'Таблица комментариев v2', owner: 'Милена Петрова', updatedAt: '10:54' },
  { id: '5', title: 'Тестирование', owner: 'Кристина Шишова', updatedAt: '10:50' },
  { id: '6', title: 'Видео контент v4', owner: 'Елена Иванова', updatedAt: '14:46' },
  { id: '7', title: 'СНП', owner: 'Елена Иванова', updatedAt: '14:33' },
];

export function SpreadsheetsPage() {
  return (
    <div className="spreadsheets">
      <h1 className="spreadsheets__title">Таблицы</h1>

      <ul className="spreadsheets__list">
        {SPREADSHEETS.map((s) => (
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
              <span className="spreadsheets__owner">{s.owner}</span>
              <span className="spreadsheets__time">{s.updatedAt}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
