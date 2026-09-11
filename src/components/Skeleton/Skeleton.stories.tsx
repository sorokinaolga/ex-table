import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton, SkeletonText, SkeletonButton, SkeletonAvatar } from './Skeleton';

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ padding: 24, width: 360 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    radius: {
      control: 'inline-radio',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl', 'pill'],
    },
    animation: {
      control: 'inline-radio',
      options: ['pulse', 'wave', 'none'],
    },
    circle: { control: 'boolean' },
    width: { control: 'text' },
    height: { control: 'text' },
  },
  args: {
    width: '100%',
    height: 16,
    radius: 'sm',
    animation: 'pulse',
    circle: false,
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Animations: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <div style={{ fontSize: 12, color: 'var(--theme-muted)', marginBottom: 4 }}>pulse</div>
        <Skeleton {...args} animation="pulse" />
      </div>
      <div>
        <div style={{ fontSize: 12, color: 'var(--theme-muted)', marginBottom: 4 }}>wave</div>
        <Skeleton {...args} animation="wave" />
      </div>
      <div>
        <div style={{ fontSize: 12, color: 'var(--theme-muted)', marginBottom: 4 }}>none</div>
        <Skeleton {...args} animation="none" />
      </div>
    </div>
  ),
};

export const Radii: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {(['none', 'xs', 'sm', 'md', 'lg', 'xl', 'pill'] as const).map((r) => (
        <Skeleton key={r} {...args} radius={r} height={24} />
      ))}
    </div>
  ),
};

export const Circle: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12 }}>
      <Skeleton {...args} circle height={24} width={24} />
      <Skeleton {...args} circle height={40} width={40} />
      <Skeleton {...args} circle height={56} width={56} />
    </div>
  ),
};

export const TextLines: Story = {
  render: () => <SkeletonText lines={3} />,
};

export const TextManyLines: Story = {
  render: () => <SkeletonText lines={6} lastLineWidth="40%" />,
};

export const ButtonSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <SkeletonButton size="xs" />
      <SkeletonButton size="sm" />
      <SkeletonButton size="md" />
    </div>
  ),
};

export const AvatarSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <SkeletonAvatar size={24} />
      <SkeletonAvatar size={40} />
      <SkeletonAvatar size={56} />
    </div>
  ),
};

export const ListPlaceholder: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <SkeletonAvatar size={40} animation="wave" />
          <div style={{ flex: 1 }}>
            <Skeleton animation="wave" height={14} width={i % 2 === 0 ? '60%' : '80%'} radius="xs" style={{ marginBottom: 6 }} />
            <Skeleton animation="wave" height={12} width="40%" radius="xs" />
          </div>
        </div>
      ))}
    </div>
  ),
};

export const CardPlaceholder: Story = {
  render: () => (
    <div
      style={{
        padding: 16,
        border: '1px solid var(--theme-border-subtle)',
        borderRadius: 8,
        background: 'var(--theme-surface)',
      }}
    >
      <Skeleton animation="wave" height={160} radius="md" />
      <div style={{ marginTop: 12 }}>
        <Skeleton animation="wave" height={18} radius="xs" width="60%" />
      </div>
      <div style={{ marginTop: 8 }}>
        <SkeletonText lines={2} animation="wave" lineHeight={12} gap={6} />
      </div>
      <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
        <SkeletonButton size="sm" animation="wave" />
        <SkeletonButton size="sm" animation="wave" />
      </div>
    </div>
  ),
};
