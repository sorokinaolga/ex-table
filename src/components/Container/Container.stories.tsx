import type { Meta, StoryObj } from '@storybook/react-vite';
import { Container } from './Container';
import { Text } from '../Text/Text';
import { Paper } from '../Paper/Paper';

const meta = {
  title: 'Components/Container',
  component: Container,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    fluid: { control: 'boolean' },
    padding: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
    },
    centered: { control: 'boolean' },
  },
  args: {
    size: 'md',
    fluid: false,
    padding: 'lg',
    centered: true,
  },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

const DemoContent = () => (
  <Paper padding="lg" withBorder style={{ background: 'var(--theme-accent-subtle)' }}>
    <Text weight="medium">Контент контейнера</Text>
    <Text size="sm" color="dimmed">
      Максимальная ширина ограничена, отступы применяются автоматически.
    </Text>
  </Paper>
);

export const Default: Story = {
  render: (args) => (
    <div style={{ background: 'var(--theme-bg-subtle)', minHeight: '100vh' }}>
      <Container {...args}>
        <DemoContent />
      </Container>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ background: 'var(--theme-bg-subtle)' }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((s) => (
        <div key={s} style={{ padding: '8px 0' }}>
          <Text size="xs" color="dimmed" style={{ textAlign: 'center', marginBottom: 4 }}>
            size={s}
          </Text>
          <Container {...args} size={s}>
            <DemoContent />
          </Container>
        </div>
      ))}
    </div>
  ),
};

export const Fluid: Story = {
  render: (args) => (
    <div style={{ background: 'var(--theme-bg-subtle)' }}>
      <Container {...args} fluid>
        <DemoContent />
      </Container>
    </div>
  ),
};

export const Paddings: Story = {
  render: (args) => (
    <div style={{ background: 'var(--theme-bg-subtle)' }}>
      {(['none', 'sm', 'lg', 'xl'] as const).map((p) => (
        <div key={p} style={{ padding: '8px 0' }}>
          <Text size="xs" color="dimmed" style={{ textAlign: 'center', marginBottom: 4 }}>
            padding={p}
          </Text>
          <Container {...args} padding={p}>
            <DemoContent />
          </Container>
        </div>
      ))}
    </div>
  ),
};

export const NotCentered: Story = {
  render: (args) => (
    <div style={{ background: 'var(--theme-bg-subtle)' }}>
      <Container {...args} centered={false}>
        <DemoContent />
      </Container>
    </div>
  ),
};

export const AsMain: Story = {
  render: (args) => (
    <div style={{ background: 'var(--theme-bg-subtle)' }}>
      <Container {...args} as="main">
        <DemoContent />
      </Container>
    </div>
  ),
};

export const PageExample: Story = {
  render: () => (
    <div style={{ background: 'var(--theme-bg-subtle)', minHeight: '100vh' }}>
      <header
        style={{
          background: 'var(--theme-surface)',
          borderBottom: '1px solid var(--theme-border-subtle)',
        }}
      >
        <Container size="lg" padding="lg">
          <Text weight="semibold">Шапка страницы</Text>
        </Container>
      </header>
      <Container size="lg" padding="lg">
        <Paper padding="xl" withBorder style={{ marginTop: 16 }}>
          <Text weight="medium">Основной контент</Text>
          <Text size="sm" color="dimmed" style={{ marginTop: 8 }}>
            Контейнер ограничивает ширину контента и центрирует его. На широких экранах контент не растягивается на всю ширину.
          </Text>
        </Paper>
      </Container>
    </div>
  ),
};
