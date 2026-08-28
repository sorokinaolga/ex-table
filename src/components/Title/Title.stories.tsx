import type { Meta, StoryObj } from '@storybook/react-vite';
import { Title } from './Title';

const meta = {
  title: 'Components/Title',
  component: Title,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 640 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    order: {
      control: 'inline-radio',
      options: [1, 2, 3, 4, 5, 6],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'],
    },
    weight: {
      control: 'select',
      options: ['regular', 'medium', 'semibold', 'bold'],
    },
    color: {
      control: 'select',
      options: ['default', 'dimmed', 'muted', 'accent', 'error', 'inherit'],
    },
    truncate: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: {
    children: 'Заголовок страницы',
    order: 3,
    weight: 'semibold',
    color: 'default',
  },
} satisfies Meta<typeof Title>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Orders: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Title {...args} order={1}>
        Заголовок h1
      </Title>
      <Title {...args} order={2}>
        Заголовок h2
      </Title>
      <Title {...args} order={3}>
        Заголовок h3
      </Title>
      <Title {...args} order={4}>
        Заголовок h4
      </Title>
      <Title {...args} order={5}>
        Заголовок h5
      </Title>
      <Title {...args} order={6}>
        Заголовок h6
      </Title>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Title {...args} size="xs">
        xs — маленький
      </Title>
      <Title {...args} size="sm">
        sm
      </Title>
      <Title {...args} size="md">
        md
      </Title>
      <Title {...args} size="lg">
        lg
      </Title>
      <Title {...args} size="xl">
        xl
      </Title>
      <Title {...args} size="2xl">
        2xl
      </Title>
      <Title {...args} size="3xl">
        3xl
      </Title>
      <Title {...args} size="4xl">
        4xl
      </Title>
      <Title {...args} size="5xl">
        5xl
      </Title>
    </div>
  ),
};

export const Weights: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Title {...args} weight="regular">
        Regular
      </Title>
      <Title {...args} weight="medium">
        Medium
      </Title>
      <Title {...args} weight="semibold">
        Semibold
      </Title>
      <Title {...args} weight="bold">
        Bold
      </Title>
    </div>
  ),
};

export const Colors: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Title {...args} color="default">
        Default
      </Title>
      <Title {...args} color="dimmed">
        Dimmed
      </Title>
      <Title {...args} color="muted">
        Muted
      </Title>
      <Title {...args} color="accent">
        Accent
      </Title>
      <Title {...args} color="error">
        Error
      </Title>
    </div>
  ),
};

export const OrderWithSize: Story = {
  args: {
    order: 1,
    size: 'md',
    children: 'h1, но визуально как md',
  },
};

export const AsDiv: Story = {
  args: {
    as: 'div',
    order: 2,
    children: 'div вместо h2 (без семантики заголовка)',
  },
};

export const Truncate: Story = {
  args: {
    truncate: true,
    order: 4,
    children: 'Очень длинный заголовок, который не умещается в одну строку и должен обрезаться с многоточием в конце',
  },
};
