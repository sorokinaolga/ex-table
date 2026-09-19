import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { RingProgress } from './RingProgress';
import { Button } from '../Button/Button';
import { Stack } from '../Stack/Stack';

const meta = {
  title: 'Components/RingProgress',
  component: RingProgress,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: { type: 'number', min: 40, max: 300 } },
    thickness: { control: { type: 'number', min: 2, max: 30 } },
    roundCaps: { control: 'boolean' },
  },
  args: {
    sections: [{ value: 60, color: 'accent' }],
    size: 120,
    thickness: 12,
    roundCaps: false,
    label: '60%',
  },
} satisfies Meta<typeof RingProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const RoundCaps: Story = {
  args: { roundCaps: true },
};

export const WithoutLabel: Story = {
  args: { label: undefined },
};

export const MultipleSections: Story = {
  args: {
    sections: [
      { value: 40, color: 'accent' },
      { value: 25, color: 'warning' },
      { value: 15, color: 'error' },
    ],
    label: '80%',
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <RingProgress {...args} size={60} thickness={6} sections={[{ value: 60, color: 'accent' }]} label="60%" />
      <RingProgress {...args} size={100} thickness={10} sections={[{ value: 45, color: 'accent' }]} label="45%" />
      <RingProgress {...args} size={160} thickness={16} sections={[{ value: 75, color: 'accent' }]} label="75%" />
    </div>
  ),
};

export const Thickness: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <RingProgress {...args} thickness={4} sections={[{ value: 50, color: 'accent' }]} />
      <RingProgress {...args} thickness={12} sections={[{ value: 50, color: 'accent' }]} />
      <RingProgress {...args} thickness={24} sections={[{ value: 50, color: 'accent' }]} />
    </div>
  ),
};

export const Colors: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 24 }}>
      <RingProgress {...args} sections={[{ value: 70, color: 'accent' }]} />
      <RingProgress {...args} sections={[{ value: 70, color: 'warning' }]} />
      <RingProgress {...args} sections={[{ value: 70, color: 'error' }]} />
      <RingProgress {...args} sections={[{ value: 70, color: 'default' }]} />
    </div>
  ),
};

export const Interactive: Story = {
  render: (args) => {
    const [value, setValue] = useState(30);

    return (
      <Stack gap="md" align="center">
        <RingProgress {...args} sections={[{ value, color: value >= 100 ? 'accent' : 'warning' }]} label={`${value}%`} />
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

export const DashboardExample: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 32 }}>
      <div style={{ textAlign: 'center' }}>
        <RingProgress size={100} thickness={8} sections={[{ value: 92, color: 'accent' }]} label={<span style={{ fontSize: 18 }}>92%</span>} />
        <div style={{ fontSize: 12, color: 'var(--theme-muted)', marginTop: 8 }}>Готово</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <RingProgress
          size={100}
          thickness={8}
          sections={[
            { value: 40, color: 'accent' },
            { value: 25, color: 'warning' },
            { value: 15, color: 'error' },
          ]}
          label={<span style={{ fontSize: 16 }}>80%</span>}
        />
        <div style={{ fontSize: 12, color: 'var(--theme-muted)', marginTop: 8 }}>Использовано</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <RingProgress size={100} thickness={8} sections={[{ value: 30, color: 'error' }]} label={<span style={{ fontSize: 18 }}>30%</span>} />
        <div style={{ fontSize: 12, color: 'var(--theme-muted)', marginTop: 8 }}>Просрочено</div>
      </div>
    </div>
  ),
};
