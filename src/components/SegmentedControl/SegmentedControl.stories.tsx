import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { SegmentedControl } from './SegmentedControl';
import { Text } from '../Text/Text';

const meta = {
  title: 'Components/SegmentedControl',
  component: SegmentedControl,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
    },
    color: {
      control: 'select',
      options: ['accent', 'warning', 'error', 'default'],
    },
    fullWidth: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    disabled: { control: 'boolean' },
    withItemsBorders: { control: 'boolean' },
    transitionDuration: { control: 'number' },
  },
  args: {
    data: ['День', 'Неделя', 'Месяц'],
    defaultValue: 'День',
    size: 'md',
    orientation: 'horizontal',
    color: 'default',
    fullWidth: false,
    readOnly: false,
    disabled: false,
    withItemsBorders: true,
    transitionDuration: 200,
  },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AccentColor: Story = {
  args: { color: 'accent', defaultValue: 'Неделя' },
};

export const WarningColor: Story = {
  args: { color: 'warning', defaultValue: 'Неделя' },
};

export const ErrorColor: Story = {
  args: { color: 'error', defaultValue: 'Неделя' },
};

export const Colors: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {(['default', 'accent', 'warning', 'error'] as const).map((c) => (
        <div key={c}>
          <Text size="xs" color="muted" style={{ marginBottom: 4 }}>
            color={c}
          </Text>
          <SegmentedControl {...args} color={c} />
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {(['xs', 'sm', 'md', 'lg'] as const).map((s) => (
        <div key={s}>
          <Text size="xs" color="muted" style={{ marginBottom: 4 }}>
            size={s}
          </Text>
          <SegmentedControl {...args} size={s} />
        </div>
      ))}
    </div>
  ),
};

export const FullWidth: Story = {
  args: { fullWidth: true },
  render: (args) => (
    <div style={{ width: 400 }}>
      <SegmentedControl {...args} />
    </div>
  ),
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    data: ['Профиль', 'Безопасность', 'Уведомления'],
    defaultValue: 'Профиль',
  },
};

export const WithDisabledItem: Story = {
  args: {
    data: ['Активные', { value: 'archived', label: 'Архив', disabled: true }, 'Черновики'],
    defaultValue: 'Активные',
  },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const ReadOnly: Story = {
  args: { readOnly: true },
};

export const NoBorders: Story = {
  args: { withItemsBorders: false },
};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState('День');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SegmentedControl {...args} value={value} onChange={setValue} />
        <Text size="sm" color="muted">
          Выбрано: {value}
        </Text>
      </div>
    );
  },
};

export const ViewSwitcher: Story = {
  render: () => {
    const [view, setView] = useState('list');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 300 }}>
        <SegmentedControl
          color="default"
          value={view}
          onChange={setView}
          data={[
            { value: 'list', label: '📋 Список' },
            { value: 'grid', label: '⊞ Сетка' },
            { value: 'table', label: '⊞ Таблица' },
          ]}
          fullWidth
        />
        <Text size="sm" color="muted">
          Режим: {view}
        </Text>
      </div>
    );
  },
};

export const TabFilter: Story = {
  render: () => {
    const [filter, setFilter] = useState('all');
    return (
      <div style={{ width: 360 }}>
        <SegmentedControl
          color="default"
          value={filter}
          onChange={setFilter}
          data={[
            { value: 'all', label: 'Все' },
            { value: 'active', label: 'Активные' },
            { value: 'archived', label: 'Архив' },
            { value: 'draft', label: 'Черновики' },
          ]}
          fullWidth
        />
      </div>
    );
  },
};

export const PeriodSwitch: Story = {
  render: () => {
    const [period, setPeriod] = useState('day');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SegmentedControl
          value={period}
          onChange={setPeriod}
          data={[
            { value: 'day', label: 'День' },
            { value: 'week', label: 'Неделя' },
            { value: 'month', label: 'Месяц' },
            { value: 'year', label: 'Год' },
          ]}
        />
        <Text size="sm" color="muted">
          Период: {period}
        </Text>
      </div>
    );
  },
};
