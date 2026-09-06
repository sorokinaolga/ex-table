import type { Meta, StoryObj } from '@storybook/react-vite';
import { Group, GroupSpacer } from './Group';
import { Button } from '../Button/Button';
import { Paper } from '../Paper/Paper';
import { Text } from '../Text/Text';

const meta = {
  title: 'Components/Group',
  component: Group,
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
    nowrap: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
  args: {
    gap: 'md',
    align: 'center',
    justify: 'flex-start',
    nowrap: false,
    fullWidth: false,
  },
} satisfies Meta<typeof Group>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Group {...args}>
      <Button variant="default">Первая</Button>
      <Button variant="accent">Вторая</Button>
      <Button variant="warning">Третья</Button>
    </Group>
  ),
};

export const Gaps: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((g) => (
        <div key={g}>
          <Text size="xs" color="dimmed" style={{ marginBottom: 4 }}>
            gap={g}
          </Text>
          <Group {...args} gap={g}>
            <Button size="xs">A</Button>
            <Button size="xs">B</Button>
            <Button size="xs">C</Button>
          </Group>
        </div>
      ))}
    </div>
  ),
};

export const Justify: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 400 }}>
      {(['flex-start', 'center', 'flex-end', 'space-between'] as const).map((j) => (
        <div key={j}>
          <Text size="xs" color="dimmed" style={{ marginBottom: 4 }}>
            justify={j}
          </Text>
          <Group {...args} justify={j} fullWidth style={{ background: 'var(--theme-bg-subtle)', padding: 8 }}>
            <Button size="xs">A</Button>
            <Button size="xs">B</Button>
            <Button size="xs">C</Button>
          </Group>
        </div>
      ))}
    </div>
  ),
};

export const Align: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 16 }}>
      {(['flex-start', 'center', 'flex-end', 'stretch'] as const).map((a) => (
        <div key={a}>
          <Text size="xs" color="dimmed" style={{ marginBottom: 4 }}>
            align={a}
          </Text>
          <Group
            {...args}
            align={a}
            style={{
              height: 100,
              background: 'var(--theme-bg-subtle)',
              padding: 8,
            }}
          >
            <Paper padding="sm">
              <Text size="sm">A</Text>
            </Paper>
            <Paper padding="lg">
              <Text size="sm">B</Text>
            </Paper>
          </Group>
        </div>
      ))}
    </div>
  ),
};

export const Nowrap: Story = {
  render: (args) => (
    <div style={{ width: 260 }}>
      <Text size="xs" color="dimmed" style={{ marginBottom: 4 }}>
        nowrap=false (по умолчанию)
      </Text>
      <Group {...args} style={{ background: 'var(--theme-bg-subtle)' }}>
        <Button size="xs">Очень длинная кнопка</Button>
        <Button size="xs">Ещё одна</Button>
        <Button size="xs">Третья</Button>
      </Group>

      <Text size="xs" color="dimmed" style={{ marginTop: 16, marginBottom: 4 }}>
        nowrap=true
      </Text>
      <Group
        {...args}
        nowrap
        style={{
          background: 'var(--theme-bg-subtle)',
          overflow: 'auto',
        }}
      >
        <Button size="xs" style={{ flexShrink: 0 }}>
          Очень длинная кнопка
        </Button>
        <Button size="xs" style={{ flexShrink: 0 }}>
          Ещё одна
        </Button>
      </Group>
    </div>
  ),
};

export const WithSpacer: Story = {
  render: (args) => (
    <Group {...args} fullWidth style={{ width: 400 }}>
      <Button variant="default">Назад</Button>
      <GroupSpacer />
      <Button variant="accent">Сохранить</Button>
    </Group>
  ),
};

export const CustomGap: Story = {
  render: (args) => (
    <Group {...args} gap={24}>
      <Button>Первая</Button>
      <Button>Вторая</Button>
      <Button>Третья</Button>
    </Group>
  ),
};

export const FullWidth: Story = {
  render: (args) => (
    <Group {...args} fullWidth justify="space-between" style={{ background: 'var(--theme-bg-subtle)', padding: 16 }}>
      <Text weight="semibold">Заголовок</Text>
      <Button size="sm" variant="accent">
        Действие
      </Button>
    </Group>
  ),
};

export const AsNav: Story = {
  render: (args) => (
    <Group {...args} as="nav" gap="lg">
      <a href="#">Главная</a>
      <a href="#">О проекте</a>
      <a href="#">Контакты</a>
    </Group>
  ),
};

export const RealWorld: Story = {
  render: () => (
    <Group
      fullWidth
      justify="space-between"
      style={{
        width: 480,
        padding: '8px 12px',
        background: 'var(--theme-surface)',
        borderBottom: '1px solid var(--theme-border-subtle)',
      }}
    >
      <Text weight="medium">Моя таблица</Text>
      <Group gap="xs">
        <Button size="xs" variant="default">
          Поделиться
        </Button>
        <Button size="xs" variant="accent">
          Экспорт
        </Button>
      </Group>
    </Group>
  ),
};
