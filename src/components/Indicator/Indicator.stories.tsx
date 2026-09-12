import type { Meta, StoryObj } from '@storybook/react-vite';
import { Indicator } from './Indicator';

function BellIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

function AvatarIcon({ initials }: { initials: string }) {
  return (
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        background: 'var(--theme-surface-hover)',
        color: 'var(--theme-fg)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 14,
        fontWeight: 500,
      }}
    >
      {initials}
    </div>
  );
}

const meta = {
  title: 'Components/Indicator',
  component: Indicator,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ padding: 32 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    position: {
      control: 'inline-radio',
      options: ['top-start', 'top-end', 'bottom-start', 'bottom-end'],
    },
    color: {
      control: 'select',
      options: ['accent', 'default', 'warning', 'error'],
    },
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    withBorder: { control: 'boolean' },
    processing: { control: 'boolean' },
    disabled: { control: 'boolean' },
    offset: { control: 'number' },
    label: { control: 'text' },
  },
  args: {
    position: 'top-end',
    color: 'accent',
    size: 'md',
    withBorder: false,
    processing: false,
    disabled: false,
  },
} satisfies Meta<typeof Indicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Indicator {...args}>
      <BellIcon />
    </Indicator>
  ),
};

export const Dot: Story = {
  render: (args) => (
    <Indicator {...args}>
      <BellIcon />
    </Indicator>
  ),
};

export const WithLabel: Story = {
  render: (args) => (
    <Indicator {...args} label={5}>
      <BellIcon />
    </Indicator>
  ),
};

export const WithBigLabel: Story = {
  render: (args) => (
    <Indicator {...args} label="99+">
      <BellIcon />
    </Indicator>
  ),
};

export const Positions: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
      {(['top-start', 'top-end', 'bottom-start', 'bottom-end'] as const).map((p) => (
        <div key={p} style={{ textAlign: 'center' }}>
          <Indicator {...args} position={p} label={p}>
            <AvatarIcon initials="A" />
          </Indicator>
          <div
            style={{
              fontSize: 11,
              color: 'var(--theme-muted)',
              marginTop: 12,
            }}
          >
            {p}
          </div>
        </div>
      ))}
    </div>
  ),
};

export const Colors: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
      {(['accent', 'default', 'warning', 'error'] as const).map((c) => (
        <Indicator key={c} {...args} color={c}>
          <BellIcon />
        </Indicator>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((s) => (
        <Indicator key={s} {...args} size={s} label="1">
          <BellIcon />
        </Indicator>
      ))}
    </div>
  ),
};

export const WithBorder: Story = {
  render: (args) => (
    <Indicator {...args} withBorder color="error" label={3} style={{ background: 'var(--theme-bg-subtle)', padding: 8, borderRadius: 8 }}>
      <AvatarIcon initials="AB" />
    </Indicator>
  ),
};

export const Processing: Story = {
  render: (args) => (
    <Indicator {...args} processing color="accent">
      <AvatarIcon initials="AB" />
    </Indicator>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <Indicator {...args} disabled label={5}>
      <BellIcon />
    </Indicator>
  ),
};

export const OnlineStatus: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      <Indicator position="bottom-end" color="accent" size="sm" withBorder>
        <AvatarIcon initials="И" />
      </Indicator>
      <Indicator position="bottom-end" color="warning" size="sm" withBorder>
        <AvatarIcon initials="П" />
      </Indicator>
      <Indicator position="bottom-end" color="default" size="sm" withBorder>
        <AvatarIcon initials="О" />
      </Indicator>
    </div>
  ),
};

export const NotificationBell: Story = {
  render: () => (
    <Indicator label={12} color="error" size="sm" withBorder>
      <BellIcon />
    </Indicator>
  ),
};
