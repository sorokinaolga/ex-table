import type { Meta, StoryObj } from '@storybook/react-vite';
import { ButtonIcon } from './ButtonIcon';
import { ArrowLeftIcon, MenuIcon, MoreHorizontalIcon, PlusIcon } from '../icons';

const meta = {
  title: 'Components/ButtonIcon',
  component: ButtonIcon,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md'],
    },
    variant: {
      control: 'select',
      options: ['default', 'accent', 'warning', 'subtle'],
    },
    shape: {
      control: 'inline-radio',
      options: ['square', 'rounded', 'circle'],
    },
    disabled: { control: 'boolean' },
  },
  args: {
    size: 'md',
    variant: 'default',
    shape: 'rounded',
    'aria-label': 'Действие',
    children: <PlusIcon />,
  },
} satisfies Meta<typeof ButtonIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Circle: Story = {
  args: { shape: 'circle' },
};

export const Accent: Story = {
  args: {
    variant: 'accent',
    shape: 'circle',
    children: <PlusIcon />,
  },
};

export const Subtle: Story = {
  args: {
    variant: 'subtle',
    shape: 'circle',
    children: <MoreHorizontalIcon />,
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    shape: 'circle',
    children: <ArrowLeftIcon />,
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <ButtonIcon {...args} size="xs" />
      <ButtonIcon {...args} size="sm" />
      <ButtonIcon {...args} size="md" />
    </div>
  ),
};

export const Shapes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <ButtonIcon {...args} shape="square" />
      <ButtonIcon {...args} shape="rounded" />
      <ButtonIcon {...args} shape="circle" />
    </div>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <ButtonIcon {...args} variant="default" />
      <ButtonIcon {...args} variant="accent" />
      <ButtonIcon {...args} variant="warning" />
      <ButtonIcon {...args} variant="subtle" />
    </div>
  ),
};

export const IconSet: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <ButtonIcon {...args} aria-label="Назад" variant="subtle" shape="circle">
        <ArrowLeftIcon />
      </ButtonIcon>
      <ButtonIcon {...args} aria-label="Добавить" variant="subtle" shape="rounded">
        <PlusIcon />
      </ButtonIcon>
      <ButtonIcon {...args} aria-label="Меню" variant="subtle" shape="rounded">
        <MenuIcon />
      </ButtonIcon>
      <ButtonIcon {...args} aria-label="Ещё" variant="subtle" shape="circle">
        <MoreHorizontalIcon />
      </ButtonIcon>
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
};
