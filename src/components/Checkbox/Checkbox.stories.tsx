import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Checkbox } from './Checkbox';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md'] },
    disabled: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    label: { control: 'text' },
    description: { control: 'text' },
    error: { control: 'text' },
  },
  args: {
    label: 'Checkbox',
    size: 'md',
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
  args: { defaultChecked: true, label: 'Включено' },
};

export const WithDescription: Story = {
  args: {
    label: 'Уведомления',
    description: 'Получать оповещения на почту',
  },
};

export const WithError: Story = {
  args: {
    label: 'Согласие',
    error: 'Нужно ваше согласие, чтобы продолжить',
  },
};

export const Indeterminate: Story = {
  args: { indeterminate: true, label: 'Часть выбрана' },
};

export const Disabled: Story = {
  args: { disabled: true, label: 'Недоступно' },
};

export const DisabledChecked: Story = {
  args: { disabled: true, defaultChecked: true, label: 'Недоступно (выбрано)' },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Checkbox {...args} size="xs" label="xs" />
      <Checkbox {...args} size="sm" label="sm" />
      <Checkbox {...args} size="md" label="md" />
    </div>
  ),
};

export const Controlled: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return <Checkbox {...args} checked={checked} onChange={(e) => setChecked(e.target.checked)} label={checked ? 'Включено' : 'Выключено'} />;
  },
};

export const Group: Story = {
  render: () => {
    const items = ['HTML', 'CSS', 'JavaScript'];
    const [selected, setSelected] = useState<string[]>(['HTML']);

    const allChecked = selected.length === items.length;
    const someChecked = selected.length > 0 && !allChecked;

    const toggleAll = () => {
      setSelected(allChecked ? [] : [...items]);
    };

    const toggleOne = (item: string) => {
      setSelected((prev) => (prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]));
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Checkbox label="Выбрать всё" checked={allChecked} indeterminate={someChecked} onChange={toggleAll} />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            paddingLeft: 26,
          }}
        >
          {items.map((item) => (
            <Checkbox key={item} label={item} checked={selected.includes(item)} onChange={() => toggleOne(item)} />
          ))}
        </div>
      </div>
    );
  },
};
