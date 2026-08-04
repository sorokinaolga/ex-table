import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Select } from './Select';
import type { SelectData } from './types';

const FRUITS: SelectData = [
  { value: 'apple', label: 'Яблоко' },
  { value: 'banana', label: 'Банан' },
  { value: 'cherry', label: 'Вишня' },
  { value: 'date', label: 'Финик' },
  { value: 'elderberry', label: 'Бузина', disabled: true },
  { value: 'fig', label: 'Инжир' },
];

const GROUPED: SelectData = [
  {
    group: 'Фрукты',
    items: [
      { value: 'apple', label: 'Яблоко' },
      { value: 'banana', label: 'Банан' },
      { value: 'cherry', label: 'Вишня' },
    ],
  },
  {
    group: 'Овощи',
    items: [
      { value: 'carrot', label: 'Морковь' },
      { value: 'potato', label: 'Картофель' },
      { value: 'tomato', label: 'Помидор' },
    ],
  },
];

const meta = {
  title: 'Components/Select',
  component: Select,
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
    disabled: { control: 'boolean' },
    searchable: { control: 'boolean' },
    clearable: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
  args: {
    data: FRUITS,
    size: 'md',
    placeholder: 'Выберите фрукт',
    fullWidth: true,
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabel: Story = {
  args: { label: 'Фрукт' },
};

export const WithDescription: Story = {
  args: {
    label: 'Фрукт',
    description: 'Мы не передаём выбор третьим лицам',
  },
};

export const WithError: Story = {
  args: {
    label: 'Фрукт',
    error: 'Обязательное поле',
  },
};

export const Searchable: Story = {
  args: { label: 'Фрукт', searchable: true },
};

export const Clearable: Story = {
  args: { label: 'Фрукт', clearable: true, defaultValue: 'apple' },
};

export const Grouped: Story = {
  args: { data: GROUPED, label: 'Продукт' },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'apple' },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Select {...args} size="xs" placeholder="xs" />
      <Select {...args} size="sm" placeholder="sm" />
      <Select {...args} size="md" placeholder="md" />
    </div>
  ),
};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | null>(null);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Select {...args} value={value} onChange={setValue} label="Фрукт" />
        <div style={{ fontSize: 13, color: 'var(--select-placeholder)' }}>Выбрано: {value ?? '—'}</div>
      </div>
    );
  },
};

export const NothingFound: Story = {
  args: {
    searchable: true,
    label: 'Фрукт',
    nothingFoundMessage: 'Такого фрукта нет',
  },
};
