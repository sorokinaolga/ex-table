import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { PinInput } from './PinInput';
import { Text } from '../Text/Text';

const meta = {
  title: 'Components/PinInput',
  component: PinInput,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    length: { control: { type: 'number', min: 2, max: 8 } },
    type: {
      control: 'inline-radio',
      options: ['number', 'alphanumeric', 'text'],
    },
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    mask: { control: 'boolean' },
    oneTimeCode: { control: 'boolean' },
    disabled: { control: 'boolean' },
    autoFocus: { control: 'boolean' },
    label: { control: 'text' },
    description: { control: 'text' },
    error: { control: 'text' },
    withAsterisk: { control: 'boolean' },
  },
  args: {
    length: 4,
    type: 'number',
    size: 'md',
    mask: false,
    oneTimeCode: false,
    disabled: false,
    autoFocus: false,
    label: 'Код подтверждения',
  },
} satisfies Meta<typeof PinInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Length6: Story = {
  args: { length: 6, label: 'Код из 6 цифр' },
};

export const Alphanumeric: Story = {
  args: {
    type: 'alphanumeric',
    length: 6,
    label: 'Буквы и цифры',
    description: 'Например, A1B2C3',
  },
};

export const Masked: Story = {
  args: {
    mask: true,
    label: 'Скрытый PIN',
    description: 'Символы скрыты',
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <PinInput {...args} size="xs" label="xs" />
      <PinInput {...args} size="sm" label="sm" />
      <PinInput {...args} size="md" label="md" />
      <PinInput {...args} size="lg" label="lg" />
    </div>
  ),
};

export const WithError: Story = {
  args: {
    error: 'Неверный код',
    defaultValue: '1234',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: '1234',
  },
};

export const WithDescription: Story = {
  args: {
    description: 'Мы отправили код на номер +7 *** 123-45-67',
  },
};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <PinInput {...args} value={value} onChange={setValue} onComplete={(v) => alert(`Код: ${v}`)} />
        <Text size="sm" color="muted">
          Введено: {value || '—'} ({value.length}/{args.length ?? 4})
        </Text>
      </div>
    );
  },
};

export const AutoComplete2FA: Story = {
  render: () => {
    const [code, setCode] = useState('');
    return (
      <div style={{ width: 320 }}>
        <div
          style={{
            padding: 24,
            borderRadius: 12,
            border: '1px solid var(--theme-border-subtle)',
            background: 'var(--theme-surface)',
            textAlign: 'center',
          }}
        >
          <Text weight="semibold" size="lg">
            Введите код
          </Text>
          <Text size="sm" color="muted" style={{ marginTop: 4 }}>
            Отправили на +7 *** 123-45-67
          </Text>
          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
            <PinInput length={6} type="number" oneTimeCode size="md" value={code} onChange={setCode} onComplete={(v) => alert(`Отправляем код ${v}`)} inputAriaLabel="Цифра кода" />
          </div>
          <Text size="xs" color="muted" style={{ marginTop: 12 }}>
            Не получили код?{' '}
            <a href="#" style={{ color: 'var(--theme-accent)' }}>
              Отправить повторно
            </a>
          </Text>
        </div>
      </div>
    );
  },
};

export const AutoCompleteShowcase: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {(['number', 'alphanumeric', 'text'] as const).map((t) => (
        <div key={t}>
          <Text size="xs" color="muted" style={{ marginBottom: 4 }}>
            type={t}
          </Text>
          <PinInput type={t} length={4} />
        </div>
      ))}
    </div>
  ),
};
