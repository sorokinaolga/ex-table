import type { Meta, StoryObj } from '@storybook/react-vite';
import { Link, MemoryRouter } from 'react-router';
import { Anchor } from './Anchor';
import { Text } from '../Text/Text';
import { Title } from '../Title/Title';

const meta = {
  title: 'Components/Anchor',
  component: Anchor,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    weight: {
      control: 'select',
      options: ['regular', 'medium', 'semibold', 'bold'],
    },
    color: {
      control: 'select',
      options: ['accent', 'default', 'dimmed', 'inherit'],
    },
    underline: {
      control: 'inline-radio',
      options: ['always', 'hover', 'never'],
    },
    inherit: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: {
    children: 'Ссылка',
    href: '#',
    size: 'md',
    weight: 'regular',
    color: 'accent',
    underline: 'hover',
  },
} satisfies Meta<typeof Anchor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const UnderlineVariants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Anchor {...args} underline="always">
        underline=always
      </Anchor>
      <Anchor {...args} underline="hover">
        underline=hover
      </Anchor>
      <Anchor {...args} underline="never">
        underline=never
      </Anchor>
    </div>
  ),
};

export const Colors: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Anchor {...args} color="accent">
        accent
      </Anchor>
      <Anchor {...args} color="default">
        default
      </Anchor>
      <Anchor {...args} color="dimmed">
        dimmed
      </Anchor>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Anchor {...args} size="xs">
        xs
      </Anchor>
      <Anchor {...args} size="sm">
        sm
      </Anchor>
      <Anchor {...args} size="md">
        md
      </Anchor>
      <Anchor {...args} size="lg">
        lg
      </Anchor>
      <Anchor {...args} size="xl">
        xl
      </Anchor>
    </div>
  ),
};

export const Weights: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Anchor {...args} weight="regular">
        regular
      </Anchor>
      <Anchor {...args} weight="medium">
        medium
      </Anchor>
      <Anchor {...args} weight="semibold">
        semibold
      </Anchor>
      <Anchor {...args} weight="bold">
        bold
      </Anchor>
    </div>
  ),
};

export const External: Story = {
  args: {
    href: 'https://example.com',
    children: 'Внешняя ссылка (target="_blank" + rel="noopener")',
  },
};

export const Inherit: Story = {
  args: {
    inherit: true,
    underline: 'always',
    children: 'Наследует цвет родителя',
  },
  decorators: [
    (Story) => (
      <Text color="error" size="lg">
        Родительский текст: <Story />
      </Text>
    ),
  ],
};

export const InsideTitle: Story = {
  render: () => (
    <Title order={2}>
      Заголовок со{' '}
      <Anchor inherit underline="always" href="#">
        ссылкой внутри
      </Anchor>
    </Title>
  ),
};

export const InsideText: Story = {
  render: () => (
    <Text>
      Есть много способов{' '}
      <Anchor href="#" underline="always">
        сослаться на что-то
      </Anchor>{' '}
      в середине предложения.
    </Text>
  ),
};

export const AsRouterLink: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  render: () => (
    <Anchor as={Link} to="/spreadsheets">
      Перейти к таблицам (React Router)
    </Anchor>
  ),
};

export const AsButton: Story = {
  render: () => (
    <Anchor as="button" type="button" onClick={() => alert('Клик!')} underline="always">
      Нажми меня
    </Anchor>
  ),
};
