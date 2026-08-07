import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { RadioGroup } from './RadioGroup';

const DELIVERY = [
  { value: 'standard', label: 'Стандарт', description: '1–2 дня, 200 ₽' },
  { value: 'express', label: 'Экспресс', description: 'Сегодня, 500 ₽' },
  { value: 'pickup', label: 'Самовывоз', description: 'Бесплатно' },
];

const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md'] },
    orientation: { control: 'inline-radio', options: ['vertical', 'horizontal'] },
    disabled: { control: 'boolean' },
  },
  args: {
    data: DELIVERY,
    label: 'Способ доставки',
    size: 'md',
    orientation: 'vertical',
    name: 'delivery',
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDescription: Story = {
  args: { description: 'Выберите один из вариантов доставки' },
};

export const WithError: Story = {
  args: { error: 'Обязательное поле' },
};

export const Horizontal: Story = {
  args: { orientation: 'horizontal', label: undefined },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'standard' },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <RadioGroup {...args} size="xs" label="xs" />
      <RadioGroup {...args} size="sm" label="sm" />
      <RadioGroup {...args} size="md" label="md" />
    </div>
  ),
};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState('standard');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <RadioGroup {...args} value={value} onChange={setValue} />
        <div style={{ fontSize: 13, color: 'var(--radio-description)' }}>Выбрано: {value}</div>
      </div>
    );
  },
};
