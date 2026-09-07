import type { Meta, StoryObj } from '@storybook/react-vite';
import { Center } from './Center';
import { Text } from '../Text/Text';
import { Button } from '../Button/Button';
import { Paper } from '../Paper/Paper';

const meta = {
  title: 'Components/Center',
  component: Center,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    as: { control: 'text' },
    inline: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    fullHeight: { control: 'boolean' },
  },
  args: {
    inline: false,
    fullWidth: false,
    fullHeight: false,
  },
} satisfies Meta<typeof Center>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Center
      {...args}
      style={{
        width: 240,
        height: 120,
        background: 'var(--theme-bg-subtle)',
        borderRadius: 8,
      }}
    >
      <Text>По центру</Text>
    </Center>
  ),
};

export const FullWidth: Story = {
  render: (args) => (
    <Center
      {...args}
      fullWidth
      style={{
        height: 120,
        background: 'var(--theme-bg-subtle)',
        borderRadius: 8,
      }}
    >
      <Text>fullWidth</Text>
    </Center>
  ),
};

export const FullHeight: Story = {
  render: (args) => (
    <div style={{ height: 200, width: 240 }}>
      <Center
        {...args}
        fullHeight
        style={{
          background: 'var(--theme-bg-subtle)',
          borderRadius: 8,
        }}
      >
        <Text>fullHeight</Text>
      </Center>
    </div>
  ),
};

export const Both: Story = {
  render: (args) => (
    <div style={{ height: 240, width: 240 }}>
      <Center
        {...args}
        fullWidth
        fullHeight
        style={{
          background: 'var(--theme-bg-subtle)',
          borderRadius: 8,
        }}
      >
        <Text>fullWidth + fullHeight</Text>
      </Center>
    </div>
  ),
};

export const Inline: Story = {
  render: (args) => (
    <div style={{ padding: 16, background: 'var(--theme-bg-subtle)' }}>
      Текст с{' '}
      <Center
        {...args}
        inline
        style={{
          width: 24,
          height: 24,
          background: 'var(--theme-accent)',
          borderRadius: 4,
          color: 'var(--theme-accent-fg)',
          fontSize: 12,
        }}
      >
        ✓
      </Center>{' '}
      inline-центром.
    </div>
  ),
};

export const AsSection: Story = {
  render: (args) => (
    <Center
      {...args}
      as="section"
      style={{
        width: 240,
        height: 120,
        background: 'var(--theme-bg-subtle)',
        borderRadius: 8,
      }}
    >
      <Text>as=&quot;section&quot;</Text>
    </Center>
  ),
};

export const EmptyState: Story = {
  render: () => (
    <Center
      style={{
        width: 360,
        height: 240,
        background: 'var(--theme-bg-subtle)',
        borderRadius: 12,
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <Text size="xl">📭</Text>
        <Text weight="semibold" style={{ marginTop: 8 }}>
          Ничего нет
        </Text>
        <Text size="sm" color="dimmed" style={{ marginTop: 4 }}>
          Создайте первую таблицу, чтобы начать.
        </Text>
        <div style={{ marginTop: 16 }}>
          <Button variant="accent" size="sm">
            Создать таблицу
          </Button>
        </div>
      </div>
    </Center>
  ),
};

export const CenteredCard: Story = {
  render: () => (
    <Paper shadow="sm" padding="xl" style={{ width: 280 }}>
      <Center fullWidth style={{ flexDirection: 'column' }}>
        <Text size="xl">🎉</Text>
        <Text weight="semibold" style={{ marginTop: 8 }}>
          Готово
        </Text>
        <Text size="sm" color="dimmed" style={{ marginTop: 4, textAlign: 'center' }}>
          Все данные сохранены.
        </Text>
      </Center>
    </Paper>
  ),
};
