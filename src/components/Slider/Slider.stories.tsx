import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Slider } from './Slider';
import { Text } from '../Text/Text';

const meta = {
  title: 'Components/Slider',
  component: Slider,
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
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    color: {
      control: 'select',
      options: ['accent', 'warning', 'error', 'default'],
    },
    range: { control: 'boolean' },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    precision: { control: 'number' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    alwaysShowLabel: { control: 'boolean' },
  },
  args: {
    defaultValue: 50,
    min: 0,
    max: 100,
    step: 1,
    size: 'md',
    color: 'accent',
    disabled: false,
    readOnly: false,
    alwaysShowLabel: true,
  },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Range: Story = {
  args: {
    range: true,
    defaultValue: [25, 75],
  },
};

export const WithLabel: Story = {
  args: {
    label: (v: number) => `${v}%`,
    defaultValue: 60,
  },
};

export const LabelFormatter: Story = {
  args: {
    labelFormatter: (v: number) => `$${v}`,
    defaultValue: 40,
  },
};

export const Marks: Story = {
  args: {
    defaultValue: 50,
    marks: [
      { value: 0, label: '0' },
      { value: 25, label: '25' },
      { value: 50, label: '50' },
      { value: 75, label: '75' },
      { value: 100, label: '100' },
    ],
  },
};

export const Precision: Story = {
  args: {
    step: 0.1,
    precision: 1,
    defaultValue: 5.5,
    min: 0,
    max: 10,
    label: (v: number) => v.toFixed(1),
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {(['xs', 'sm', 'md', 'lg'] as const).map((s) => (
        <div key={s}>
          <Text size="xs" color="muted" style={{ marginBottom: 4 }}>
            size={s}
          </Text>
          <Slider {...args} size={s} defaultValue={50} />
        </div>
      ))}
    </div>
  ),
};

export const Colors: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {(['accent', 'warning', 'error', 'default'] as const).map((c) => (
        <div key={c}>
          <Text size="xs" color="muted" style={{ marginBottom: 4 }}>
            color={c}
          </Text>
          <Slider {...args} color={c} defaultValue={60} />
        </div>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 60 },
};

export const ReadOnly: Story = {
  args: { readOnly: true, defaultValue: 60 },
};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState(30);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Slider {...args} value={value} onChange={(v) => setValue(v as number)} label={(v: number) => `${v}%`} />
        <Text size="sm" color="muted">
          Значение: {value}
        </Text>
      </div>
    );
  },
};

export const ControlledRange: Story = {
  render: (args) => {
    const [value, setValue] = useState<[number, number]>([20, 80]);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Slider {...args} range value={value} onChange={(v) => setValue(v as [number, number])} label={(v: number) => `$${v}`} />
        <Text size="sm" color="muted">
          Диапазон: {value[0]} — {value[1]}
        </Text>
      </div>
    );
  },
};

export const VolumeControl: Story = {
  render: () => {
    const [volume, setVolume] = useState(65);
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 18 }}>🔈</span>
        <div style={{ flex: 1 }}>
          <Slider value={volume} onChange={(v) => setVolume(v as number)} label={(v: number) => `${v}%`} size="sm" />
        </div>
        <span style={{ fontSize: 18 }}>🔊</span>
      </div>
    );
  },
};

export const PriceRange: Story = {
  render: () => {
    const [price, setPrice] = useState<[number, number]>([1000, 5000]);
    return (
      <div>
        <Text weight="medium" style={{ marginBottom: 8 }}>
          Цена
        </Text>
        <Slider
          range
          min={0}
          max={10000}
          step={500}
          value={price}
          onChange={(v) => setPrice(v as [number, number])}
          label={(v: number) => `${v.toLocaleString('ru-RU')} ₽`}
          marks={[
            { value: 0, label: '0' },
            { value: 5000, label: '5 000' },
            { value: 10000, label: '10 000' },
          ]}
        />
        <Text size="sm" color="muted" style={{ marginTop: 8 }}>
          {price[0].toLocaleString('ru-RU')} ₽ — {price[1].toLocaleString('ru-RU')} ₽
        </Text>
      </div>
    );
  },
};

export const ZoomControl: Story = {
  render: () => {
    const [zoom, setZoom] = useState(100);
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: 300 }}>
        <span>−</span>
        <div style={{ flex: 1 }}>
          <Slider min={50} max={200} step={10} value={zoom} onChange={(v) => setZoom(v as number)} labelFormatter={(v) => `${v}%`} size="sm" />
        </div>
        <span>+</span>
      </div>
    );
  },
};
