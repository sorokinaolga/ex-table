import './RootLayout.css';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';
import { useTheme } from '../../theme/useTheme';

function ThemeSwitcher() {
  const { colorScheme, toggle } = useTheme();
  return (
    <Button variant="default" onClick={toggle}>
      {colorScheme === 'light' ? '🌙 Тёмная' : '☀️ Светлая'}
    </Button>
  );
}

export function RootLayout() {
  return (
    <>
      <header style={{ display: 'flex', gap: 16 }}>
        Заголовок
        <Input
          placeholder="Поиск..."
          leftSection={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          }
          fullWidth
        />
        <Button variant="default" size="sm" leftSection={<span>✓</span>}>
          Accent
        </Button>
        <ThemeSwitcher />
      </header>
      <section>Таблица</section>
      <footer>Подвал</footer>
    </>
  );
}
