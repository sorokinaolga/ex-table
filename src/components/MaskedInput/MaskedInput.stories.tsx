import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { MaskedInput } from './MaskedInput';
import { Text } from '../Text/Text';

const meta = {
  title: 'Components/MaskedInput',
  component: MaskedInput,
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
    fullWidth: { control: 'boolean' },
    mask: { control: 'text' },
    label: { control: 'text' },
    description: { control: 'text' },
    error: { control: 'text' },
    placeholder: { control: 'text' },
  },
  args: {
    mask: '+7 (999) 999-99-99',
    label: 'Телефон',
    size: 'md',
    fullWidth: true,
    disabled: false,
  },
} satisfies Meta<typeof MaskedInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Phone: Story = {
  args: {
    label: 'Телефон',
    placeholder: '+7 (___) ___-__-__',
  },
};

export const Card: Story = {
  args: {
    mask: '9999 9999 9999 9999',
    label: 'Номер карты',
    placeholder: '0000 0000 0000 0000',
  },
};

export const Date: Story = {
  args: {
    mask: '99.99.9999',
    label: 'Дата',
    placeholder: 'ДД.ММ.ГГГГ',
  },
};

export const Time: Story = {
  args: {
    mask: '99:99',
    label: 'Время',
    placeholder: 'ЧЧ:ММ',
  },
};

export const Passport: Story = {
  args: {
    mask: '99 99 999999',
    label: 'Паспорт',
    placeholder: 'Серия и номер',
  },
};

export const INN: Story = {
  args: {
    mask: '999999999999',
    label: 'ИНН',
    placeholder: '12 цифр',
    description: 'Индивидуальный номер налогоплательщика',
  },
};

export const SNILS: Story = {
  args: {
    mask: '999-999-999 99',
    label: 'СНИЛС',
    placeholder: '123-456-789 00',
  },
};

export const WithLetters: Story = {
  args: {
    mask: 'AAA-999',
    label: 'Код (буквы-цифры)',
    placeholder: 'AAA-999',
    description: '3 буквы, дефис, 3 цифры',
  },
};

export const Mixed: Story = {
  args: {
    mask: '**-99-AA',
    label: 'Смешанный формат',
    placeholder: 'XX-00-XX',
    description: 'Буква или цифра, цифра, буква',
  },
};

export const WithError: Story = {
  args: {
    error: 'Введите номер полностью',
    defaultValue: '+7 (999',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: '+7 (999) 123-45-67',
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <MaskedInput {...args} size="xs" label="xs" />
      <MaskedInput {...args} size="sm" label="sm" />
      <MaskedInput {...args} size="md" label="md" />
    </div>
  ),
};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    const [done, setDone] = useState(false);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <MaskedInput {...args} value={value} onChange={setValue} onComplete={() => setDone(true)} />
        <Text size="sm" color="muted">
          Значение: {value || '—'}
        </Text>
        <Text size="sm" color={done ? 'accent' : 'muted'}>
          {done ? 'Маска заполнена полностью' : 'Заполните маску'}
        </Text>
      </div>
    );
  },
};

export const FormExample: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <div
        style={{
          padding: 16,
          borderRadius: 8,
          border: '1px solid var(--theme-border-subtle)',
          background: 'var(--theme-surface)',
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: 12 }}>Оформление заказа</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <MaskedInput mask="+7 (999) 999-99-99" label="Телефон" placeholder="+7 (___) ___-__-__" />
          <MaskedInput mask="9999 9999 9999 9999" label="Номер карты" placeholder="0000 0000 0000 0000" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <MaskedInput mask="99/99" label="Срок" placeholder="ММ/ГГ" />
            <MaskedInput mask="999" label="CVC" placeholder="000" />
          </div>
        </div>
      </div>
    </div>
  ),
};
