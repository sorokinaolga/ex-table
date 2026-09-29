import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { TagsInput } from './TagsInput';
import { Text } from '../Text/Text';

const SUGGESTIONS = ['React', 'TypeScript', 'Vite', 'Storybook', 'CSS', 'HTML', 'JavaScript', 'Vue', 'Angular', 'Svelte'];

const meta = {
  title: 'Components/TagsInput',
  component: TagsInput,
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
    maxTags: { control: 'number' },
    allowDuplicates: { control: 'boolean' },
    clearable: { control: 'boolean' },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    label: { control: 'text' },
    description: { control: 'text' },
    error: { control: 'text' },
    placeholder: { control: 'text' },
  },
  args: {
    label: 'Технологии',
    placeholder: 'Введите тег и нажмите Enter',
    size: 'md',
    allowDuplicates: false,
    clearable: false,
    disabled: false,
    fullWidth: true,
  },
} satisfies Meta<typeof TagsInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { defaultValue: ['React', 'TypeScript'] },
};

export const Empty: Story = {};

export const WithSuggestions: Story = {
  args: {
    data: SUGGESTIONS,
    description: 'Начните вводить — появятся подсказки',
  },
};

export const MaxTags: Story = {
  args: {
    maxTags: 3,
    defaultValue: ['React', 'TypeScript'],
    description: 'Максимум 3 тега',
  },
};

export const AllowDuplicates: Story = {
  args: {
    allowDuplicates: true,
    defaultValue: ['React', 'React', 'Vue'],
  },
};

export const Clearable: Story = {
  args: {
    clearable: true,
    defaultValue: ['React', 'TypeScript', 'Vite'],
  },
};

export const WithError: Story = {
  args: {
    error: 'Добавьте минимум один тег',
    defaultValue: [],
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: ['React', 'TypeScript'],
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <TagsInput {...args} size="xs" label="xs" defaultValue={['A', 'B']} />
      <TagsInput {...args} size="sm" label="sm" defaultValue={['A', 'B']} />
      <TagsInput {...args} size="md" label="md" defaultValue={['A', 'B']} />
    </div>
  ),
};

export const WithLeftIcon: Story = {
  args: {
    label: undefined,
    placeholder: 'Поиск технологий…',
    defaultValue: ['React'],
    leftSection: (
      <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
};

export const Controlled: Story = {
  render: (args) => {
    const [tags, setTags] = useState<string[]>(['React']);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <TagsInput {...args} data={SUGGESTIONS} value={tags} onChange={setTags} />
        <Text size="sm" color="muted">
          Теги: {tags.length > 0 ? tags.join(', ') : '—'}
        </Text>
      </div>
    );
  },
};

export const EmailRecipients: Story = {
  args: {
    label: 'Получатели',
    placeholder: 'email@example.com',
    description: 'Введите email и нажмите Enter',
    defaultValue: ['ivan@example.com', 'maria@example.com'],
    splitChars: [',', ' ', ';'],
    clearable: true,
  },
};

export const SkillTags: Story = {
  args: {
    label: 'Навыки',
    placeholder: 'Добавить навык…',
    data: SUGGESTIONS,
    maxTags: 8,
    clearable: true,
    defaultValue: ['React', 'TypeScript'],
  },
};
