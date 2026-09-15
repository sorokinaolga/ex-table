import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar, AvatarGroup } from './Avatar';
import { Indicator } from '../Indicator/Indicator';

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    shape: {
      control: 'inline-radio',
      options: ['circle', 'rounded', 'square'],
    },
    color: {
      control: 'select',
      options: ['default', 'accent', 'warning', 'error'],
    },
    src: { control: 'text' },
    name: { control: 'text' },
    initials: { control: 'text' },
  },
  args: {
    size: 'md',
    shape: 'circle',
    color: 'default',
    name: 'Иван Петров',
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Initials: Story = {};

export const WithImage: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?img=12',
    name: 'Мария Сидорова',
  },
};

export const ExplicitInitials: Story = {
  args: {
    initials: 'AB',
    name: 'Что-то другое',
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Avatar {...args} size="xs" />
      <Avatar {...args} size="sm" />
      <Avatar {...args} size="md" />
      <Avatar {...args} size="lg" />
      <Avatar {...args} size="xl" />
    </div>
  ),
};

export const CustomSize: Story = {
  args: { size: 96 },
};

export const Shapes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Avatar {...args} shape="circle" />
      <Avatar {...args} shape="rounded" />
      <Avatar {...args} shape="square" />
    </div>
  ),
};

export const Colors: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Avatar {...args} color="default" name="A" />
      <Avatar {...args} color="accent" name="B" />
      <Avatar {...args} color="warning" name="C" />
      <Avatar {...args} color="error" name="D" />
    </div>
  ),
};

export const BrokenImage: Story = {
  args: {
    src: 'https://example.ex/image.jpg',
    name: 'Иван Петров',
  },
};

export const CustomFallback: Story = {
  args: {
    fallback: <span>👤</span>,
    name: 'Иван Петров',
  },
};

export const WithOnlineStatus: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 24 }}>
      <Indicator position="bottom-end" color="accent" size="sm" withBorder>
        <Avatar {...args} name="Иван Петров" />
      </Indicator>
      <Indicator position="bottom-end" color="warning" size="sm" withBorder>
        <Avatar {...args} name="Мария Сидорова" />
      </Indicator>
      <Indicator position="bottom-end" color="default" size="sm" withBorder>
        <Avatar {...args} name="Олег Кузнецов" />
      </Indicator>
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <AvatarGroup size="md">
      <Avatar name="Иван Петров" color="accent" />
      <Avatar name="Мария Сидорова" color="warning" />
      <Avatar name="Олег Кузнецов" color="error" />
      <Avatar name="Анна Иванова" />
      <Avatar name="Пётр Смирнов" />
    </AvatarGroup>
  ),
};

export const GroupWithTotal: Story = {
  render: () => (
    <AvatarGroup size="md" total={3}>
      <Avatar name="Иван Петров" color="accent" />
      <Avatar name="Мария Сидорова" color="warning" />
      <Avatar name="Олег Кузнецов" color="error" />
      <Avatar name="Анна Иванова" />
      <Avatar name="Пётр Смирнов" />
    </AvatarGroup>
  ),
};

export const GroupSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {(['xs', 'sm', 'md', 'lg'] as const).map((s) => (
        <AvatarGroup key={s} size={s}>
          <Avatar name="A" color="accent" />
          <Avatar name="B" color="warning" />
          <Avatar name="C" color="error" />
        </AvatarGroup>
      ))}
    </div>
  ),
};

export const GroupSpacing: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <AvatarGroup size="md" spacing={4}>
        <Avatar name="A" color="accent" />
        <Avatar name="B" color="warning" />
        <Avatar name="C" color="error" />
      </AvatarGroup>
      <AvatarGroup size="md" spacing={16}>
        <Avatar name="A" color="accent" />
        <Avatar name="B" color="warning" />
        <Avatar name="C" color="error" />
      </AvatarGroup>
    </div>
  ),
};
