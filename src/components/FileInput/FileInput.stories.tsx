import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { FileInput } from './FileInput';

const meta = {
  title: 'Components/FileInput',
  component: FileInput,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 420 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md'] },
    disabled: { control: 'boolean' },
    multiple: { control: 'boolean' },
    showFileList: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    label: { control: 'text' },
    description: { control: 'text' },
    error: { control: 'text' },
    placeholder: { control: 'text' },
    buttonLabel: { control: 'text' },
  },
  args: {
    label: 'Файл',
    size: 'md',
    fullWidth: true,
  },
} satisfies Meta<typeof FileInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDescription: Story = {
  args: { description: 'PDF или DOCX, до 10 МБ' },
};

export const WithError: Story = {
  args: { error: 'Файл слишком большой' },
};

export const Multiple: Story = {
  args: { multiple: true, label: 'Файлы', placeholder: 'Перетащите сюда или' },
};

export const WithAccept: Story = {
  args: {
    accept: 'image/*',
    label: 'Изображение',
    placeholder: 'Перетащите картинку или',
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <FileInput {...args} size="xs" label="xs" />
      <FileInput {...args} size="sm" label="sm" />
      <FileInput {...args} size="md" label="md" />
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true, label: 'Недоступно' },
};

export const Controlled: Story = {
  render: (args) => {
    const [files, setFiles] = useState<File[]>([]);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <FileInput {...args} multiple onChange={setFiles} description={files.length > 0 ? `Выбрано файлов: ${files.length}` : 'Файлы не выбраны'} />
      </div>
    );
  },
};

export const CustomFileItem: Story = {
  args: {
    multiple: true,
    renderFile: (file, index) => (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 10px',
          border: '1px solid var(--file-input-file-border)',
          borderRadius: 6,
          background: 'var(--file-input-file-bg)',
          fontSize: 13,
        }}
      >
        <span>
          #{index + 1} — {file.name}
        </span>
        <span style={{ color: 'var(--file-input-file-meta)' }}>{file.type || 'unknown'}</span>
      </div>
    ),
  },
};
