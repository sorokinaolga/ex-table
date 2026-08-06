import type { Meta, StoryObj } from '@storybook/react-vite';
import { Radio } from './Radio';

const meta = {
  title: 'Components/Radio',
  component: Radio,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md'] },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    description: { control: 'text' },
    error: { control: 'text' },
  },
  args: {
    label: 'Опция',
    name: 'demo-radio',
    value: 'option',
    size: 'md',
  },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
  args: { defaultChecked: true, label: 'Выбрано' },
};

export const WithDescription: Story = {
  args: {
    label: 'Доставка',
    description: 'Привезём за 1–2 дня',
  },
};

export const WithError: Story = {
  args: {
    label: 'Способ оплаты',
    error: 'Выберите способ оплаты',
  },
};

export const Disabled: Story = {
  args: { disabled: true, label: 'Недоступно' },
};

export const DisabledChecked: Story = {
  args: { disabled: true, defaultChecked: true, label: 'Недоступно (выбрано)' },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Radio {...args} size="xs" label="xs" value="xs" />
      <Radio {...args} size="sm" label="sm" value="sm" />
      <Radio {...args} size="md" label="md" value="md" />
    </div>
  ),
};
