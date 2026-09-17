import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Progress } from './Progress';
import { Button } from '../Button/Button';
import { Stack } from '../Stack/Stack';

const meta = {
  title: 'Components/Progress',
  component: Progress,
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
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    radius: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg', 'xl', 'pill'],
    },
    color: {
      control: 'select',
      options: ['accent', 'warning', 'error', 'default'],
    },
    withLabel: { control: 'boolean' },
    striped: { control: 'boolean' },
    animated: { control: 'boolean' },
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
  },
  args: {
    value: 60,
    size: 'md',
    radius: 'pill',
    color: 'accent',
    withLabel: false,
    striped: false,
    animated: false,
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabel: Story = {
  args: { withLabel: true, value: 42 },
};

export const Sizes: Story = {
  render: (args) => (
    <Stack gap="md">
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((s) => (
        <Progress {...args} key={s} size={s} value={60} />
      ))}
    </Stack>
  ),
};

export const Colors: Story = {
  render: (args) => (
    <Stack gap="md">
      <Progress {...args} color="accent" value={80} />
      <Progress {...args} color="warning" value={50} />
      <Progress {...args} color="error" value={30} />
      <Progress {...args} color="default" value={60} />
    </Stack>
  ),
};

export const Radii: Story = {
  render: (args) => (
    <Stack gap="md">
      {(['xs', 'sm', 'md', 'lg', 'xl', 'pill'] as const).map((r) => (
        <Progress {...args} key={r} radius={r} value={50} size="lg" />
      ))}
    </Stack>
  ),
};

export const Striped: Story = {
  args: { striped: true, value: 60 },
};

export const Animated: Story = {
  args: { striped: true, animated: true, value: 60 },
};

export const MultipleSections: Story = {
  args: {
    sections: [
      { value: 40, color: 'accent', label: '40%' },
      { value: 25, color: 'warning', label: '25%' },
      { value: 15, color: 'error', label: '15%' },
      { value: 20, color: 'default' },
    ],
    size: 'lg',
  },
};

export const SectionsWithoutLabels: Story = {
  args: {
    sections: [
      { value: 60, color: 'accent' },
      { value: 40, color: 'default' },
    ],
    size: 'md',
  },
};

export const CustomLabel: Story = {
  args: { label: '3 из 5', value: 60, size: 'lg' },
};

export const Interactive: Story = {
  render: (args) => {
    const [value, setValue] = useState(30);

    return (
      <Stack gap="md">
        <Progress {...args} value={value} withLabel />
        <div style={{ display: 'flex', gap: 8 }}>
          <Button size="xs" variant="default" onClick={() => setValue((v) => Math.max(0, v - 10))}>
            −10
          </Button>
          <Button size="xs" variant="accent" onClick={() => setValue((v) => Math.min(100, v + 10))}>
            +10
          </Button>
        </div>
      </Stack>
    );
  },
};

export const FileUploadExample: Story = {
  render: () => {
    const [progress, setProgress] = useState(0);

    return (
      <Stack gap="sm">
        <Progress value={progress} withLabel color={progress >= 100 ? 'accent' : 'default'} />
        <Button
          size="xs"
          variant="accent"
          onClick={() => {
            setProgress(0);
            const interval = setInterval(() => {
              setProgress((p) => {
                if (p >= 100) {
                  clearInterval(interval);
                  return 100;
                }
                return p + 5;
              });
            }, 100);
          }}
        >
          Начать загрузку
        </Button>
      </Stack>
    );
  },
};

export const StorageUsageExample: Story = {
  render: () => (
    <Stack gap="sm">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 13,
          color: 'var(--theme-fg-subtle)',
        }}
      >
        <span>Использовано хранилище</span>
        <span>6.2 ГБ из 10 ГБ</span>
      </div>
      <Progress
        sections={[
          { value: 42, color: 'accent' },
          { value: 20, color: 'warning' },
          { value: 38, color: 'default' },
        ]}
        size="lg"
      />
    </Stack>
  ),
};
