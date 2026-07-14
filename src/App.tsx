import './App.css';
import { Button } from './components/Button/Button';
import { useTheme } from './theme/useTheme';

function ThemeSwitcher() {
  const { colorScheme, toggle } = useTheme();
  return (
    <Button variant="default" onClick={toggle}>
      {colorScheme === 'light' ? '🌙 Тёмная' : '☀️ Светлая'}
    </Button>
  );
}

function App() {
  return (
    <>
      <header style={{ display: 'flex', gap: 16 }}>
        Заголовок
        <Button variant="default" size="xs">
          Default
        </Button>
        <Button variant="accent" size="sm" leftSection={<span>✓</span>}>
          Accent
        </Button>
        <Button variant="warning" size="md">
          Warning
        </Button>
        <ThemeSwitcher />
      </header>
      <section>Таблица</section>
      <footer>Подвал</footer>
    </>
  );
}

export default App;
