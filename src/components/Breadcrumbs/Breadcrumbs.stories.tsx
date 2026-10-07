import type { Meta, StoryObj } from '@storybook/react-vite';
import { Link } from 'react-router';
import { Breadcrumbs } from './Breadcrumbs';

const meta = {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 600 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    separator: { control: 'text' },
    'aria-label': { control: 'text' },
  },
  args: {
    separator: '/',
    'aria-label': 'Хлебные крошки',
  },
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Breadcrumbs {...args}>
      <a href="#">Главная</a>
      <a href="#">Таблицы</a>
      <span>Моя таблица</span>
    </Breadcrumbs>
  ),
};

export const WithRouterLink: Story = {
  render: (args) => (
    <Breadcrumbs {...args}>
      <Link to="/">Главная</Link>
      <Link to="/spreadsheets">Таблицы</Link>
      <span>Моя таблица</span>
    </Breadcrumbs>
  ),
};

export const CustomSeparator: Story = {
  args: { separator: '›' },
  render: (args) => (
    <Breadcrumbs {...args}>
      <a href="#">Главная</a>
      <a href="#">Продукты</a>
      <a href="#">Электроника</a>
      <span>Наушники</span>
    </Breadcrumbs>
  ),
};

export const ArrowSeparator: Story = {
  args: {
    separator: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    ),
  },
  render: (args) => (
    <Breadcrumbs {...args}>
      <a href="#">Главная</a>
      <a href="#">Настройки</a>
      <span>Профиль</span>
    </Breadcrumbs>
  ),
};

export const LongPath: Story = {
  render: (args) => (
    <Breadcrumbs {...args}>
      <a href="#">Главная</a>
      <a href="#">Организация</a>
      <a href="#">Проекты</a>
      <a href="#">Маркетинг</a>
      <a href="#">Кампании</a>
      <a href="#">Осень 2026</a>
      <span>Отчёт по конверсии</span>
    </Breadcrumbs>
  ),
};

export const WithSeparatorComponent: Story = {
  render: (args) => (
    <Breadcrumbs {...args}>
      <a href="#">Главная</a>
      <Breadcrumbs.Separator>→</Breadcrumbs.Separator>
      <a href="#">Таблицы</a>
      <span>Моя таблица</span>
    </Breadcrumbs>
  ),
};

export const SpreadsheetNavigation: Story = {
  render: () => (
    <Breadcrumbs separator="/">
      <Link to="/spreadsheets">Таблицы</Link>
      <span>Ежемесячный отчёт</span>
    </Breadcrumbs>
  ),
};

export const InPageHeader: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Breadcrumbs separator="/">
        <Link to="/">Главная</Link>
        <Link to="/spreadsheets">Таблицы</Link>
        <span>Моя таблица</span>
      </Breadcrumbs>
      <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>Моя таблица</h1>
    </div>
  ),
};
