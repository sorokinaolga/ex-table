import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Textarea } from './Textarea';

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
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
    resize: {
      control: 'inline-radio',
      options: ['none', 'vertical', 'horizontal', 'both'],
    },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    withAsterisk: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    autosize: { control: 'boolean' },
    clearable: { control: 'boolean' },
    showCount: { control: 'boolean' },
    label: { control: 'text' },
    description: { control: 'text' },
    error: { control: 'text' },
    placeholder: { control: 'text' },
  },
  args: {
    label: 'Сообщение',
    placeholder: 'Введите текст...',
    size: 'md',
    fullWidth: true,
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDescription: Story = {
  args: { description: 'Не более 500 символов' },
};

export const WithError: Story = {
  args: { error: 'Сообщение слишком короткое' },
};

export const WithAsterisk: Story = {
  args: { withAsterisk: true },
};

export const WithCounter: Story = {
  args: { showCount: true, maxLength: 200 },
};

export const Clearable: Story = {
  args: { clearable: true, defaultValue: 'Текст, который можно очистить' },
};

export const Autosize: Story = {
  args: {
    autosize: true,
    minRows: 2,
    maxRows: 8,
    placeholder: 'Начните печатать — высота будет расти',
  },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'Недоступно для редактирования' },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Textarea {...args} size="xs" label="xs" />
      <Textarea {...args} size="sm" label="sm" />
      <Textarea {...args} size="md" label="md" />
    </div>
  ),
};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return <Textarea {...args} value={value} onChange={(e) => setValue(e.target.value)} description={`Введено символов: ${value.length}`} />;
  },
};

export const ResizeNone: Story = {
  args: { resize: 'none', label: 'Без ресайза' },
};

export const ResizeBoth: Story = {
  args: { resize: 'both', label: 'Ресайз в обе стороны' },
};
