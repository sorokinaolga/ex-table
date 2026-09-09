import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    variant: {
      control: 'select',
      options: ['default', 'accent', 'warning', 'error', 'outline'],
    },
    shape: {
      control: 'inline-radio',
      options: ['square', 'rounded', 'pill'],
    },
    dot: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: {
    children: 'Badge',
    size: 'md',
    variant: 'default',
    shape: 'pill',
    dot: false,
    fullWidth: false,
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Badge {...args} variant="default">
        Default
      </Badge>
      <Badge {...args} variant="accent">
        Accent
      </Badge>
      <Badge {...args} variant="warning">
        Warning
      </Badge>
      <Badge {...args} variant="error">
        Error
      </Badge>
      <Badge {...args} variant="outline">
        Outline
      </Badge>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Badge {...args} size="xs">
        xs
      </Badge>
      <Badge {...args} size="sm">
        sm
      </Badge>
      <Badge {...args} size="md">
        md
      </Badge>
      <Badge {...args} size="lg">
        lg
      </Badge>
    </div>
  ),
};

export const Shapes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Badge {...args} shape="square">
        square
      </Badge>
      <Badge {...args} shape="rounded">
        rounded
      </Badge>
      <Badge {...args} shape="pill">
        pill
      </Badge>
    </div>
  ),
};

export const Dots: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Badge {...args} dot variant="default" />
      <Badge {...args} dot variant="accent" />
      <Badge {...args} dot variant="warning" />
      <Badge {...args} dot variant="error" />
    </div>
  ),
};

export const WithDotLabel: Story = {
  render: (args) => (
    <Badge {...args} variant="accent" leftSection={<Badge dot size="xs" variant="accent" />}>
      Онлайн
    </Badge>
  ),
};

export const WithIcon: Story = {
  render: (args) => (
    <Badge
      {...args}
      variant="accent"
      leftSection={
        <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      }
    >
      Готово
    </Badge>
  ),
};

export const Counters: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Badge {...args} variant="accent" shape="pill">
        3
      </Badge>
      <Badge {...args} variant="error" shape="pill">
        12
      </Badge>
      <Badge {...args} variant="error" shape="pill">
        99+
      </Badge>
    </div>
  ),
};

export const FullWidth: Story = {
  render: (args) => (
    <div style={{ width: 240 }}>
      <Badge {...args} fullWidth variant="accent">
        На всю ширину
      </Badge>
    </div>
  ),
};

export const StatusList: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Badge leftSection={<Badge dot size="xs" variant="accent" />}>Активна</Badge>
      <Badge leftSection={<Badge dot size="xs" variant="warning" />}>В процессе</Badge>
      <Badge leftSection={<Badge dot size="xs" variant="error" />}>Ошибка</Badge>
      <Badge leftSection={<Badge dot size="xs" variant="default" />}>Черновик</Badge>
    </div>
  ),
};

export const TagsInCard: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: 6,
        flexWrap: 'wrap',
        width: 240,
        padding: 12,
        background: 'var(--theme-surface)',
        border: '1px solid var(--theme-border-subtle)',
        borderRadius: 8,
      }}
    >
      <Badge variant="default">React</Badge>
      <Badge variant="default">TypeScript</Badge>
      <Badge variant="default">Vite</Badge>
      <Badge variant="accent">Storybook</Badge>
    </div>
  ),
};
