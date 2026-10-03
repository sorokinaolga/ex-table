import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { MultiSelect } from './MultiSelect';
import { Text } from '../Text/Text';

const FRAMEWORKS = ['React', 'Vue', 'Angular', 'Svelte', 'Solid', 'Qwik', 'Preact', 'Ember', 'Backbone', 'Alpine'];

const CITIES = [
  { value: 'msk', label: 'Москва' },
  { value: 'spb', label: 'Санкт-Петербург' },
  { value: 'nsk', label: 'Новосибирск' },
  { value: 'ekb', label: 'Екатеринбург' },
  { value: 'kzn', label: 'Казань' },
  { value: 'nnv', label: 'Нижний Новгород' },
];

const WITH_DISABLED = [
  { value: 'a', label: 'Опция A' },
  { value: 'b', label: 'Опция B', disabled: true },
  { value: 'c', label: 'Опция C' },
  { value: 'd', label: 'Опция D (недоступна)', disabled: true },
];

const meta = {
  title: 'Components/MultiSelect',
  component: MultiSelect,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md'] },
    searchable: { control: 'boolean' },
    clearable: { control: 'boolean' },
    disabled: { control: 'boolean' },
    showOnEmpty: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    maxValues: { control: 'number' },
    limit: { control: 'number' },
    label: { control: 'text' },
    description: { control: 'text' },
    error: { control: 'text' },
    placeholder: { control: 'text' },
    addValuePlaceholder: { control: 'text' },
  },
  args: {
    data: FRAMEWORKS,
    label: 'Фреймворки',
    placeholder: 'Выберите…',
    size: 'md',
    searchable: true,
    clearable: false,
    disabled: false,
    showOnEmpty: true,
    fullWidth: true,
    limit: 50,
  },
} satisfies Meta<typeof MultiSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDefaultValue: Story = {
  args: { defaultValue: ['React', 'Vue'] },
};

export const WithObjects: Story = {
  args: {
    data: CITIES,
    label: 'Города',
    placeholder: 'Выберите города…',
    defaultValue: ['msk', 'spb'],
  },
};

export const MaxValues: Story = {
  args: {
    maxValues: 3,
    defaultValue: ['React', 'Vue'],
    description: 'Максимум 3 фреймворка',
  },
};

export const Clearable: Story = {
  args: {
    clearable: true,
    defaultValue: ['React', 'Vue', 'Svelte'],
  },
};

export const WithError: Story = {
  args: {
    error: 'Выберите хотя бы один фреймворк',
    defaultValue: [],
  },
};

export const WithDisabledOptions: Story = {
  args: {
    data: WITH_DISABLED,
    label: 'С недоступными опциями',
    showOnEmpty: true,
  },
};

export const NotSearchable: Story = {
  args: {
    searchable: false,
    label: 'Без поиска',
    addValuePlaceholder: undefined,
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <MultiSelect {...args} size="xs" label="xs" defaultValue={['React']} />
      <MultiSelect {...args} size="sm" label="sm" defaultValue={['React', 'Vue']} />
      <MultiSelect {...args} size="md" label="md" defaultValue={['React', 'Vue', 'Svelte']} />
    </div>
  ),
};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState<string[]>(['React']);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <MultiSelect {...args} value={value} onChange={setValue} />
        <Text size="sm" color="muted">
          Выбрано ({value.length}): {value.join(', ') || '—'}
        </Text>
      </div>
    );
  },
};

export const NothingFound: Story = {
  args: { nothingFoundMessage: 'Такого фреймворка нет' },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: ['React', 'Vue'],
  },
};

export const SkillsPicker: Story = {
  render: () => {
    const skills = ['JavaScript', 'TypeScript', 'React', 'Vue', 'Node.js', 'Python', 'Go', 'Rust', 'SQL', 'Docker', 'Kubernetes', 'AWS'];

    const [selected, setSelected] = useState<string[]>(['React', 'TypeScript']);

    return (
      <div
        style={{
          padding: 20,
          borderRadius: 8,
          border: '1px solid var(--theme-border-subtle)',
          background: 'var(--theme-surface)',
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: 4 }}>Ваши навыки</div>
        <Text size="sm" color="muted" style={{ marginBottom: 12 }}>
          Выберите не больше 8
        </Text>
        <MultiSelect data={skills} value={selected} onChange={setSelected} maxValues={8} placeholder="Добавьте навык…" addValuePlaceholder="Добавить ещё…" clearable searchable />
        <Text size="xs" color="muted" style={{ marginTop: 8 }}>
          Выбрано: {selected.length} из 8
        </Text>
      </div>
    );
  },
};

export const TeamPicker: Story = {
  render: () => {
    const people = [
      { value: 'ivan', label: 'Иван Петров' },
      { value: 'maria', label: 'Мария Сидорова' },
      { value: 'oleg', label: 'Олег Кузнецов' },
      { value: 'anna', label: 'Анна Иванова' },
      { value: 'petr', label: 'Пётр Смирнов' },
      { value: 'elena', label: 'Елена Даниленко' },
    ];

    const [members, setMembers] = useState<string[]>([]);

    return (
      <div style={{ width: 400 }}>
        <MultiSelect
          data={people}
          value={members}
          onChange={setMembers}
          label="Участники проекта"
          description="Начните вводить имя"
          placeholder="Выберите участников…"
          addValuePlaceholder="Добавить участника…"
          clearable
          searchable
        />
        {members.length > 0 && (
          <Text size="sm" color="muted" style={{ marginTop: 8 }}>
            В команде: {members.length} чел.
          </Text>
        )}
      </div>
    );
  },
};

export const FilterExample: Story = {
  render: () => {
    const [filters, setFilters] = useState<string[]>(['active']);
    const options = [
      { value: 'active', label: 'Активные' },
      { value: 'archived', label: 'Архив' },
      { value: 'draft', label: 'Черновики' },
      { value: 'shared', label: 'Общие' },
      { value: 'private', label: 'Личные' },
    ];

    return (
      <div style={{ width: 320 }}>
        <MultiSelect data={options} value={filters} onChange={setFilters} label="Фильтры" placeholder="Все таблицы" addValuePlaceholder="Фильтры…" clearable />
      </div>
    );
  },
};
