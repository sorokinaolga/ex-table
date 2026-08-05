import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Toggle } from './Toggle';

const meta = {
  title: 'Components/Toggle',
  component: Toggle,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md'] },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    description: { control: 'text' },
    error: { control: 'text' },
  },
  args: {
    label: 'Toggle',
    size: 'md',
  },
} satisfies Meta<typeof Toggle>;

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

export const Disabled: Story = {
  args: { disabled: true, label: 'Недоступно' },
};

export const DisabledChecked: Story = {
  args: { disabled: true, defaultChecked: true, label: 'Недоступно (вкл)' },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Toggle {...args} size="xs" label="xs" />
      <Toggle {...args} size="sm" label="sm" />
      <Toggle {...args} size="md" label="md" />
    </div>
  ),
};

export const WithTrackLabels: Story = {
  args: {
    label: 'Тема оформления',
    offLabel: 'off',
    onLabel: 'on',
  },
};

export const Controlled: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return <Toggle {...args} checked={checked} onChange={(e) => setChecked(e.target.checked)} label={checked ? 'Включено' : 'Выключено'} />;
  },
};

export const WithoutLabel: Story = {
  args: { label: undefined, 'aria-label': 'Toggle' },
};
