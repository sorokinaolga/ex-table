import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Chip } from './Chip';

function CheckIcon() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

const meta = {
  title: 'Components/Chip',
  component: Chip,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md'] },
    variant: {
      control: 'select',
      options: ['default', 'accent', 'warning', 'subtle'],
    },
    shape: { control: 'inline-radio', options: ['square', 'rounded', 'pill'] },
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: {
    children: 'Chip',
    size: 'md',
    variant: 'default',
    shape: 'pill',
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Accent: Story = {
  args: { variant: 'accent' },
};

export const Warning: Story = {
  args: { variant: 'warning' },
};

export const Subtle: Story = {
  args: { variant: 'subtle' },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Chip {...args} size="xs">
        xs
      </Chip>
      <Chip {...args} size="sm">
        sm
      </Chip>
      <Chip {...args} size="md">
        md
      </Chip>
    </div>
  ),
};

export const Shapes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Chip {...args} shape="square">
        square
      </Chip>
      <Chip {...args} shape="rounded">
        rounded
      </Chip>
      <Chip {...args} shape="pill">
        pill
      </Chip>
    </div>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Chip {...args} variant="default">
        Default
      </Chip>
      <Chip {...args} variant="accent">
        Accent
      </Chip>
      <Chip {...args} variant="warning">
        Warning
      </Chip>
      <Chip {...args} variant="subtle">
        Subtle
      </Chip>
    </div>
  ),
};

export const WithLeftIcon: Story = {
  args: { leftSection: <CheckIcon />, children: 'Готово' },
};

export const WithRightIcon: Story = {
  args: { rightSection: <CheckIcon />, children: 'Проверено' },
};

export const Removable: Story = {
  args: { onRemove: () => {}, children: 'React' },
};

export const Disabled: Story = {
  args: { disabled: true, children: 'Disabled' },
};

export const Toggle: Story = {
  render: (args) => {
    const [selected, setSelected] = useState(false);
    return (
      <Chip {...args} selected={selected} onClick={() => setSelected((s) => !s)}>
        {selected ? 'Включено' : 'Выключено'}
      </Chip>
    );
  },
};

export const TagList: Story = {
  render: () => {
    const [tags, setTags] = useState(['React', 'TypeScript', 'Vite', 'Storybook']);
    return (
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {tags.map((tag) => (
          <Chip key={tag} variant="subtle" onRemove={() => setTags((prev) => prev.filter((t) => t !== tag))}>
            {tag}
          </Chip>
        ))}
      </div>
    );
  },
};
