import { Link, useParams } from 'react-router';

export function SpreadsheetPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <p>
        <Link to="/">← Назад к списку</Link>
      </p>
      <h1>Таблица #{id}</h1>
      <p>Здесь будет таблица.</p>
    </div>
  );
}
