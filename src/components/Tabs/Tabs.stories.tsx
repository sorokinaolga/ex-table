import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Tabs } from './Tabs';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 480 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md'] },
    variant: {
      control: 'select',
      options: ['default', 'pills', 'outline'],
    },
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
    },
  },
  args: {
    defaultValue: '1',
    size: 'md',
    variant: 'default',
    orientation: 'horizontal',
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Tabs {...args}>
      <Tabs.List>
        <Tabs.Tab value="1">Первый</Tabs.Tab>
        <Tabs.Tab value="2">Второй</Tabs.Tab>
        <Tabs.Tab value="3">Третий</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="1">Контент первой вкладки.</Tabs.Panel>
      <Tabs.Panel value="2">Контент второй вкладки.</Tabs.Panel>
      <Tabs.Panel value="3">Контент третьей вкладки.</Tabs.Panel>
    </Tabs>
  ),
};

export const Pills: Story = {
  render: (args) => (
    <Tabs {...args} variant="pills">
      <Tabs.List>
        <Tabs.Tab value="1">Первый</Tabs.Tab>
        <Tabs.Tab value="2">Второй</Tabs.Tab>
        <Tabs.Tab value="3">Третий</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="1">Контент 1</Tabs.Panel>
      <Tabs.Panel value="2">Контент 2</Tabs.Panel>
      <Tabs.Panel value="3">Контент 3</Tabs.Panel>
    </Tabs>
  ),
};

export const Outline: Story = {
  render: (args) => (
    <Tabs {...args} variant="outline">
      <Tabs.List>
        <Tabs.Tab value="1">Первый</Tabs.Tab>
        <Tabs.Tab value="2">Второй</Tabs.Tab>
        <Tabs.Tab value="3">Третий</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="1">Контент 1</Tabs.Panel>
      <Tabs.Panel value="2">Контент 2</Tabs.Panel>
      <Tabs.Panel value="3">Контент 3</Tabs.Panel>
    </Tabs>
  ),
};

export const Vertical: Story = {
  render: (args) => (
    <Tabs {...args} orientation="vertical">
      <Tabs.List>
        <Tabs.Tab value="1">Первый</Tabs.Tab>
        <Tabs.Tab value="2">Второй</Tabs.Tab>
        <Tabs.Tab value="3">Третий</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="1">Контент 1</Tabs.Panel>
      <Tabs.Panel value="2">Контент 2</Tabs.Panel>
      <Tabs.Panel value="3">Контент 3</Tabs.Panel>
    </Tabs>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {(['xs', 'sm', 'md'] as const).map((size) => (
        <Tabs {...args} key={size} size={size} defaultValue="1">
          <Tabs.List>
            <Tabs.Tab value="1">size {size}</Tabs.Tab>
            <Tabs.Tab value="2">tab 2</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="1">Panel for size {size}</Tabs.Panel>
          <Tabs.Panel value="2">Panel 2</Tabs.Panel>
        </Tabs>
      ))}
    </div>
  ),
};

export const WithDisabled: Story = {
  render: (args) => (
    <Tabs {...args}>
      <Tabs.List>
        <Tabs.Tab value="1">Первый</Tabs.Tab>
        <Tabs.Tab value="2" disabled>
          Недоступный
        </Tabs.Tab>
        <Tabs.Tab value="3">Третий</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="1">Контент 1</Tabs.Panel>
      <Tabs.Panel value="2">Контент 2</Tabs.Panel>
      <Tabs.Panel value="3">Контент 3</Tabs.Panel>
    </Tabs>
  ),
};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState('1');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Tabs {...args} value={value} onChange={setValue}>
          <Tabs.List>
            <Tabs.Tab value="1">Первый</Tabs.Tab>
            <Tabs.Tab value="2">Второй</Tabs.Tab>
            <Tabs.Tab value="3">Третий</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="1">Контент 1</Tabs.Panel>
          <Tabs.Panel value="2">Контент 2</Tabs.Panel>
          <Tabs.Panel value="3">Контент 3</Tabs.Panel>
        </Tabs>
        <div style={{ fontSize: 13, color: 'var(--tabs-default-fg)' }}>Выбрано: {value}</div>
      </div>
    );
  },
};
