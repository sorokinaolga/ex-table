import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { NumberInput } from './NumberInput';

const meta = {
  title: 'Components/NumberInput',
  component: NumberInput,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 280 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md'] },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    precision: { control: 'number' },
    thousandSeparator: { control: 'text' },
    decimalSeparator: { control: 'text' },
    allowNegative: { control: 'boolean' },
    clampBehavior: {
      control: 'inline-radio',
      options: ['blur', 'strict', 'none'],
    },
    hideControls: { control: 'boolean' },
    prefix: { control: 'text' },
    suffix: { control: 'text' },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    description: { control: 'text' },
    error: { control: 'text' },
  },
  args: {
    label: 'Количество',
    placeholder: 'Введите число',
    size: 'md',
    step: 1,
    thousandSeparator: ' ',
    decimalSeparator: ',',
    allowNegative: false,
    clampBehavior: 'blur',
    hideControls: false,
  },
} satisfies Meta<typeof NumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithMinMax: Story = {
  args: { min: 0, max: 100, label: 'Процент (0–100)' },
};

export const WithStep: Story = {
  args: { step: 5, min: 0, max: 100, label: 'Шаг 5' },
};

export const WithPrecision: Story = {
  args: {
    precision: 2,
    step: 0.1,
    label: 'Цена',
    defaultValue: 1234.5,
  },
};

export const WithThousandSeparator: Story = {
  args: {
    defaultValue: 1234567,
    thousandSeparator: ' ',
    label: 'С разделителем тысяч',
  },
};

export const WithPrefix: Story = {
  args: { prefix: '₽', defaultValue: 1500, label: 'Цена' },
};

export const WithSuffix: Story = {
  args: { suffix: '%', min: 0, max: 100, label: 'Процент' },
};

export const WithBoth: Story = {
  args: {
    prefix: 'от',
    suffix: '₽',
    defaultValue: 500,
    label: 'Диапазон',
  },
};

export const Negative: Story = {
  args: {
    allowNegative: true,
    defaultValue: -42,
    label: 'Температура',
    suffix: '°C',
  },
};

export const HideControls: Story = {
  args: { hideControls: true, defaultValue: 42, label: 'Без стрелок' },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 100 },
};

export const WithError: Story = {
  args: { error: 'Значение вне диапазона', min: 0, max: 10 },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <NumberInput {...args} size="xs" label="xs" />
      <NumberInput {...args} size="sm" label="sm" />
      <NumberInput {...args} size="md" label="md" />
    </div>
  ),
};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState<number | ''>(0);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <NumberInput {...args} value={value} onChange={setValue} />
        <div style={{ fontSize: 13, color: 'var(--theme-muted)' }}>Значение: {value === '' ? '—' : value}</div>
      </div>
    );
  },
};

export const ClampStrict: Story = {
  args: {
    min: 0,
    max: 100,
    clampBehavior: 'strict',
    label: 'Clamp strict (не даёт выйти)',
  },
};

export const ClampBlur: Story = {
  args: {
    min: 0,
    max: 100,
    clampBehavior: 'blur',
    label: 'Clamp blur (скругляет при blur)',
  },
};

export const ClampNone: Story = {
  args: {
    min: 0,
    max: 100,
    clampBehavior: 'none',
    label: 'Clamp none (не ограничивает)',
  },
};

export const QuantityExample: Story = {
  render: () => {
    const [qty, setQty] = useState<number | ''>(1);
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: 16,
          border: '1px solid var(--theme-border-subtle)',
          borderRadius: 8,
          background: 'var(--theme-surface)',
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 500 }}>Товар</div>
          <div style={{ fontSize: 13, color: 'var(--theme-muted)' }}>1 500 ₽ / шт</div>
        </div>
        <div style={{ width: 100 }}>
          <NumberInput min={1} max={99} value={qty} onChange={setQty} size="sm" hideControls={false} />
        </div>
      </div>
    );
  },
};

export const PriceInputExample: Story = {
  render: () => {
    const [price, setPrice] = useState<number | ''>(1250.5);
    return (
      <div style={{ width: 280 }}>
        <NumberInput label="Цена" prefix="₽" suffix="/ мес" min={0} step={50} precision={2} thousandSeparator=" " decimalSeparator="," value={price} onChange={setPrice} />
      </div>
    );
  },
};
