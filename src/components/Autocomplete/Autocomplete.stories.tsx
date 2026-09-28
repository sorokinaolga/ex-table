import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Autocomplete } from './Autocomplete';
import { Text } from '../Text/Text';

const FRUITS = ['Яблоко', 'Банан', 'Вишня', 'Инжир', 'Киви', 'Лимон', 'Манго', 'Нектарин', 'Персик', 'Слива'];

const CITIES = [
  { value: 'msk', label: 'Москва' },
  { value: 'spb', label: 'Санкт-Петербург' },
  { value: 'nsk', label: 'Новосибирск' },
  { value: 'ekb', label: 'Екатеринбург' },
  { value: 'kzn', label: 'Казань' },
  { value: 'nnv', label: 'Нижний Новгород' },
];

const meta = {
  title: 'Components/Autocomplete',
  component: Autocomplete,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md'] },
    limit: { control: 'number' },
    clearable: { control: 'boolean' },
    disabled: { control: 'boolean' },
    showOnEmpty: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    label: { control: 'text' },
    description: { control: 'text' },
    error: { control: 'text' },
    placeholder: { control: 'text' },
    nothingFoundMessage: { control: 'text' },
  },
  args: {
    data: FRUITS,
    label: 'Фрукт',
    placeholder: 'Начните вводить…',
    size: 'md',
    limit: 10,
    clearable: false,
    disabled: false,
    showOnEmpty: false,
    fullWidth: true,
  },
} satisfies Meta<typeof Autocomplete>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDescription: Story = {
  args: { description: 'Начните вводить название' },
};

export const WithError: Story = {
  args: { error: 'Фрукт не найден', defaultValue: 'Ананас' },
};

export const Clearable: Story = {
  args: { clearable: true, defaultValue: 'Яблоко' },
};

export const ShowOnEmpty: Story = {
  args: { showOnEmpty: true, label: 'Все фрукты' },
};

export const WithObjects: Story = {
  args: {
    data: CITIES,
    label: 'Город',
    placeholder: 'Москва, Санкт-Петербург…',
  },
};

export const LimitedResults: Story = {
  args: { limit: 3, label: 'Только 3 результата' },
};

export const CustomFilter: Story = {
  args: {
    label: 'Только начинающиеся с запроса',
    filter: (query, option) => {
      const label = typeof option === 'string' ? option : option.label;
      return label.toLowerCase().startsWith(query.toLowerCase().trim());
    },
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Autocomplete {...args} size="xs" label="xs" />
      <Autocomplete {...args} size="sm" label="sm" />
      <Autocomplete {...args} size="md" label="md" />
    </div>
  ),
};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    const [selected, setSelected] = useState('');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Autocomplete {...args} value={value} onChange={setValue} onOptionSubmit={setSelected} />
        <Text size="sm" color="muted">
          Ввод: {value || '—'}
        </Text>
        <Text size="sm" color="muted">
          Выбрано: {selected || '—'}
        </Text>
      </div>
    );
  },
};

export const NothingFound: Story = {
  args: { nothingFoundMessage: 'Такого фрукта нет' },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'Яблоко' },
};

export const SearchWithLeftIcon: Story = {
  args: {
    label: undefined,
    placeholder: 'Поиск…',
    leftSection: (
      <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
};

export const LargeList: Story = {
  render: () => {
    const data = Array.from({ length: 100 }, (_, i) => `Опция ${i + 1}`);
    return (
      <div style={{ width: 320 }}>
        <Autocomplete data={data} label="Из 100 опций" placeholder="Введите номер…" />
      </div>
    );
  },
};
