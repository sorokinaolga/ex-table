import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from './Stack';
import { Paper } from '../Paper/Paper';
import { Text } from '../Text/Text';

const meta = {
  title: 'Components/Stack',
  component: Stack,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    gap: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    align: {
      control: 'select',
      options: ['stretch', 'flex-start', 'center', 'flex-end', 'baseline'],
    },
    justify: {
      control: 'select',
      options: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'],
    },
    wrap: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
  args: {
    gap: 'md',
    align: 'stretch',
    justify: 'flex-start',
    wrap: false,
    fullWidth: false,
  },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

const Item = ({ n }: { n: number }) => (
  <Paper padding="md" withBorder>
    <Text>Элемент {n}</Text>
  </Paper>
);

export const Default: Story = {
  render: (args) => (
    <Stack {...args} style={{ width: 300 }}>
      <Item n={1} />
      <Item n={2} />
      <Item n={3} />
    </Stack>
  ),
};

export const Gaps: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 24 }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((g) => (
        <div key={g}>
          <Text size="xs" color="dimmed" style={{ marginBottom: 8 }}>
            gap={g}
          </Text>
          <Stack {...args} gap={g} style={{ width: 120 }}>
            <Item n={1} />
            <Item n={2} />
            <Item n={3} />
          </Stack>
        </div>
      ))}
    </div>
  ),
};

export const Align: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 24 }}>
      {(['flex-start', 'center', 'flex-end', 'stretch'] as const).map((a) => (
        <div key={a}>
          <Text size="xs" color="dimmed" style={{ marginBottom: 8 }}>
            align={a}
          </Text>
          <Stack {...args} align={a} style={{ width: 140, height: 160, background: 'var(--theme-bg-subtle)' }}>
            <Paper padding="sm" withBorder>
              <Text size="sm">A</Text>
            </Paper>
            <Paper padding="lg" withBorder>
              <Text size="sm">B</Text>
            </Paper>
          </Stack>
        </div>
      ))}
    </div>
  ),
};

export const Justify: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 24 }}>
      {(['flex-start', 'center', 'flex-end', 'space-between'] as const).map((j) => (
        <div key={j}>
          <Text size="xs" color="dimmed" style={{ marginBottom: 8 }}>
            justify={j}
          </Text>
          <Stack
            {...args}
            justify={j}
            style={{
              width: 140,
              height: 220,
              background: 'var(--theme-bg-subtle)',
            }}
          >
            <Paper padding="sm" withBorder>
              <Text size="sm">A</Text>
            </Paper>
            <Paper padding="sm" withBorder>
              <Text size="sm">B</Text>
            </Paper>
          </Stack>
        </div>
      ))}
    </div>
  ),
};

export const CustomGap: Story = {
  render: (args) => (
    <Stack {...args} gap={24} style={{ width: 300 }}>
      <Item n={1} />
      <Item n={2} />
      <Item n={3} />
    </Stack>
  ),
};

export const FullWidth: Story = {
  render: (args) => (
    <Stack {...args} fullWidth style={{ background: 'var(--theme-bg-subtle)', padding: 16 }}>
      <Item n={1} />
      <Item n={2} />
    </Stack>
  ),
};

export const AsNav: Story = {
  render: (args) => (
    <Stack {...args} as="nav" style={{ width: 200 }}>
      <a href="#">Главная</a>
      <a href="#">О проекте</a>
      <a href="#">Контакты</a>
    </Stack>
  ),
};

export const RealWorld: Story = {
  render: () => (
    <Paper shadow="sm" padding="lg" style={{ width: 320 }}>
      <Stack gap="sm">
        <Text weight="semibold" size="lg">
          Настройки
        </Text>
        <Text size="sm" color="dimmed">
          Управление профилем и безопасностью.
        </Text>
        <Stack gap="xs">
          <Text size="sm">Email: user@example.com</Text>
          <Text size="sm">Роль: администратор</Text>
        </Stack>
      </Stack>
    </Paper>
  ),
};
