import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text } from './Text';

const meta = {
  title: 'Components/Text',
  component: Text,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480 }}>
        <Story />
      </div>
    ),
  ],
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
      options: ['default', 'dimmed', 'muted', 'accent', 'error', 'warning', 'inherit'],
    },
    italic: { control: 'boolean' },
    underline: { control: 'boolean' },
    truncate: { control: 'boolean' },
    lineClamp: { control: 'number' },
    children: { control: 'text' },
  },
  args: {
    children: 'The quick brown fox jumps over the lazy dog',
    size: 'md',
    weight: 'regular',
    color: 'default',
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Text {...args} size="xs">
        xs — маленький текст
      </Text>
      <Text {...args} size="sm">
        sm — текст помельче
      </Text>
      <Text {...args} size="md">
        md — основной текст
      </Text>
      <Text {...args} size="lg">
        lg — крупнее обычного
      </Text>
      <Text {...args} size="xl">
        xl — крупный
      </Text>
    </div>
  ),
};

export const Weights: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Text {...args} weight="regular">
        Regular
      </Text>
      <Text {...args} weight="medium">
        Medium
      </Text>
      <Text {...args} weight="semibold">
        Semibold
      </Text>
      <Text {...args} weight="bold">
        Bold
      </Text>
    </div>
  ),
};

export const Colors: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Text {...args} color="default">
        Default
      </Text>
      <Text {...args} color="dimmed">
        Dimmed
      </Text>
      <Text {...args} color="muted">
        Muted
      </Text>
      <Text {...args} color="accent">
        Accent
      </Text>
      <Text {...args} color="error">
        Error
      </Text>
      <Text {...args} color="warning">
        Warning
      </Text>
    </div>
  ),
};

export const Truncate: Story = {
  args: {
    truncate: true,
    children: 'Очень длинный текст, который не умещается в одну строку и должен обрезаться с многоточием в конце',
  },
};

export const LineClamp: Story = {
  args: {
    lineClamp: 2,
    children:
      'Очень длинный текст, который должен занимать не больше двух строк. Если строк больше — остальные скрываются, а в конце появляется многоточие. Это удобно для превью карточек, превью статей и других мест, где нужно ограничить высоту текста.',
  },
};

export const AsSpan: Story = {
  args: {
    as: 'span',
    children: 'Обычный inline-текст внутри строки',
  },
};

export const AsLabel: Story = {
  args: {
    as: 'label',
    weight: 'medium',
    children: 'Подпись поля',
  },
};

export const Italic: Story = {
  args: { italic: true, children: 'Курсивный текст' },
};

export const Underline: Story = {
  args: { underline: true, children: 'Подчёркнутый текст' },
};
