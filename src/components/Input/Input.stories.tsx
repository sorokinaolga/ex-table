import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './Input';

const meta = {
  title: 'Components/Input',
  component: Input,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md'],
    },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    withAsterisk: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    label: { control: 'text' },
    description: { control: 'text' },
    error: { control: 'text' },
    placeholder: { control: 'text' },
  },
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    size: 'md',
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDescription: Story = {
  args: { description: 'Мы не передаём email третьим лицам' },
};

export const WithError: Story = {
  args: { error: 'Введите корректный email' },
};

export const WithAsterisk: Story = {
  args: { withAsterisk: true, label: 'Email' },
};

export const WithLeftSection: Story = {
  args: { leftSection: <span>📧</span> },
};

export const WithRightSection: Story = {
  args: { rightSection: <span>✓</span> },
};

export const Disabled: Story = {
  args: { disabled: true, value: 'disabled@example.com' },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Input {...args} size="xs" placeholder="xs" label={null} />
      <Input {...args} size="sm" placeholder="sm" label={null} />
      <Input {...args} size="md" placeholder="md" label={null} />
    </div>
  ),
};
