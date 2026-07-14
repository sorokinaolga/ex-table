import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';
import '../../theme/theme.css';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'accent', 'warning'],
    },
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md'],
    },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    loading: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: {
    children: 'Button',
    variant: 'default',
    size: 'md',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Accent: Story = {
  args: { variant: 'accent' },
};

export const Warning: Story = {
  args: { variant: 'warning' },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button {...args} size="xs">
        xs
      </Button>
      <Button {...args} size="sm">
        sm
      </Button>
      <Button {...args} size="md">
        md
      </Button>
    </div>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button {...args} variant="default">
        Default
      </Button>
      <Button {...args} variant="accent">
        Accent
      </Button>
      <Button {...args} variant="warning">
        Warning
      </Button>
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
};
