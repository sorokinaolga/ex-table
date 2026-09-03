import type { Meta, StoryObj } from '@storybook/react-vite';
import { Paper } from './Paper';
import { Text } from '../Text/Text';

const meta = {
  title: 'Components/Paper',
  component: Paper,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ padding: 24, background: 'var(--theme-bg-subtle)' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    radius: {
      control: 'inline-radio',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
    },
    shadow: {
      control: 'inline-radio',
      options: ['none', 'xs', 'sm', 'md', 'lg'],
    },
    padding: {
      control: 'inline-radio',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
    },
    variant: {
      control: 'inline-radio',
      options: ['surface', 'elevated', 'transparent'],
    },
    withBorder: { control: 'boolean' },
    p: { control: 'text' },
  },
  args: {
    radius: 'md',
    shadow: 'none',
    padding: 'md',
    variant: 'surface',
    withBorder: false,
  },
} satisfies Meta<typeof Paper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Paper {...args} style={{ width: 280 }}>
      <Text>Базовый Paper с фоном surface и padding md</Text>
    </Paper>
  ),
};

export const Shadows: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 16 }}>
      <Paper {...args} shadow="xs" style={{ width: 120 }}>
        <Text size="sm">xs</Text>
      </Paper>
      <Paper {...args} shadow="sm" style={{ width: 120 }}>
        <Text size="sm">sm</Text>
      </Paper>
      <Paper {...args} shadow="md" style={{ width: 120 }}>
        <Text size="sm">md</Text>
      </Paper>
      <Paper {...args} shadow="lg" style={{ width: 120 }}>
        <Text size="sm">lg</Text>
      </Paper>
    </div>
  ),
};

export const Radii: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12 }}>
      <Paper {...args} radius="none" style={{ width: 80 }}>
        <Text size="sm">none</Text>
      </Paper>
      <Paper {...args} radius="sm" style={{ width: 80 }}>
        <Text size="sm">sm</Text>
      </Paper>
      <Paper {...args} radius="md" style={{ width: 80 }}>
        <Text size="sm">md</Text>
      </Paper>
      <Paper {...args} radius="lg" style={{ width: 80 }}>
        <Text size="sm">lg</Text>
      </Paper>
      <Paper {...args} radius="xl" style={{ width: 80 }}>
        <Text size="sm">xl</Text>
      </Paper>
    </div>
  ),
};

export const WithBorder: Story = {
  args: { withBorder: true },
  render: (args) => (
    <Paper {...args} style={{ width: 280 }}>
      <Text>Paper с рамкой (withBorder)</Text>
    </Paper>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 16 }}>
      <Paper {...args} variant="surface" withBorder style={{ width: 160 }}>
        <Text size="sm">surface</Text>
      </Paper>
      <Paper {...args} variant="elevated" withBorder style={{ width: 160 }}>
        <Text size="sm">elevated</Text>
      </Paper>
      <Paper {...args} variant="transparent" withBorder style={{ width: 160 }}>
        <Text size="sm">transparent</Text>
      </Paper>
    </div>
  ),
};

export const Paddings: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {(['none', 'xs', 'sm', 'md', 'lg', 'xl'] as const).map((p) => (
        <Paper key={p} {...args} padding={p} withBorder>
          <Text size="sm">padding={p}</Text>
        </Paper>
      ))}
    </div>
  ),
};

export const CustomPadding: Story = {
  args: { p: 32 },
  render: (args) => (
    <Paper {...args} withBorder style={{ width: 280 }}>
      <Text>Кастомный padding: 32</Text>
    </Paper>
  ),
};

export const RealWorld: Story = {
  render: () => (
    <Paper shadow="sm" radius="lg" withBorder padding="lg" style={{ width: 320 }}>
      <Text weight="semibold" size="lg">
        Заголовок
      </Text>
      <Text size="sm" color="dimmed" style={{ marginTop: 8 }}>
        Это пример типичной карточки. Paper даёт поверхность, рамку и тень — остальное контент.
      </Text>
    </Paper>
  ),
};

export const Nested: Story = {
  render: () => (
    <Paper shadow="md" padding="lg" style={{ width: 320 }}>
      <Text weight="medium">Внешний Paper</Text>
      <Paper variant="elevated" shadow="sm" padding="md" withBorder style={{ marginTop: 12 }}>
        <Text size="sm">Вложенный Paper</Text>
      </Paper>
    </Paper>
  ),
};

export const AsSection: Story = {
  args: { as: 'section' },
  render: (args) => (
    <Paper {...args} withBorder style={{ width: 280 }}>
      <Text>as=&quot;section&quot;</Text>
    </Paper>
  ),
};
