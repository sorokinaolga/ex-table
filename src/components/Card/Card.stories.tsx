import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';
import { Text } from '../Text/Text';
import { Title } from '../Title/Title';
import { Button } from '../Button/Button';

const meta = {
  title: 'Components/Card',
  component: Card,
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
  },
  args: {
    radius: 'lg',
    shadow: 'sm',
    padding: 'lg',
    variant: 'surface',
    withBorder: false,
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Card {...args} style={{ width: 320 }}>
      <Text>Базовая карточка с padding lg. Внутри — только текст, без секций.</Text>
    </Card>
  ),
};

export const WithHeader: Story = {
  render: (args) => (
    <Card {...args} style={{ width: 320 }}>
      <Card.Header>Заголовок карточки</Card.Header>
      <Text size="sm" color="dimmed">
        Основной контент карточки. Заголовок отделён разделителем снизу.
      </Text>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: (args) => (
    <Card {...args} style={{ width: 320 }}>
      <Text>Основной контент</Text>
      <Card.Footer>Последнее обновление: 5 минут назад</Card.Footer>
    </Card>
  ),
};

export const WithHeaderAndFooter: Story = {
  render: (args) => (
    <Card {...args} style={{ width: 360 }}>
      <Card.Header>Заголовок</Card.Header>
      <Text size="sm" color="dimmed">
        Контент карточки с заголовком и футером. Разделители автоматические.
      </Text>
      <Card.Footer>
        <Text size="sm" color="muted">
          Обновлено 10:30
        </Text>
        <Button variant="accent" size="xs">
          Открыть
        </Button>
      </Card.Footer>
    </Card>
  ),
};

export const WithImageSection: Story = {
  render: (args) => (
    <Card {...args} padding="lg" style={{ width: 320 }}>
      <Card.Section>
        <img src="https://picsum.photos/seed/card/400/200" alt="Обложка" style={{ height: 160, width: '100%', objectFit: 'cover' }} />
      </Card.Section>
      <Title order={3} size="lg" style={{ marginTop: 12 }}>
        Заголовок с обложкой
      </Title>
      <Text size="sm" color="dimmed" style={{ marginTop: 4 }}>
        Картинка во всю ширину карточки — благодаря Card.Section.
      </Text>
    </Card>
  ),
};

export const WithColorSection: Story = {
  render: (args) => (
    <Card {...args} style={{ width: 320 }}>
      <Card.Section
        style={{
          background: 'var(--theme-accent)',
          color: 'var(--theme-accent-fg)',
          padding: '16px 20px',
          fontWeight: 600,
        }}
      >
        Цветная секция
      </Card.Section>
      <Text size="sm" style={{ marginTop: 12 }}>
        Секция с собственным фоном. Отлично подходит для бейджей и статусов.
      </Text>
    </Card>
  ),
};

export const SectionsWithContent: Story = {
  render: (args) => (
    <Card {...args} padding="lg" style={{ width: 320 }}>
      <Card.Section
        style={{
          background: 'var(--theme-surface-hover)',
          padding: '12px 20px',
          fontSize: 12,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: 'var(--theme-fg-subtle)',
        }}
      >
        Категория
      </Card.Section>
      <Title order={4} size="md" style={{ marginTop: 12 }}>
        Название статьи
      </Title>
      <Text size="sm" color="dimmed" style={{ marginTop: 4 }}>
        Краткое описание статьи с парой предложений.
      </Text>
    </Card>
  ),
};

export const Clickable: Story = {
  render: (args) => (
    <Card {...args} style={{ width: 320, cursor: 'pointer' }} onClick={() => alert('Card click')}>
      <Text weight="medium">Кликабельная карточка</Text>
      <Text size="sm" color="dimmed" style={{ marginTop: 4 }}>
        Нажми меня — я покажу alert
      </Text>
    </Card>
  ),
};

export const Grid: Story = {
  render: (args) => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 320px)',
        gap: 16,
      }}
    >
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} {...args}>
          <Card.Header>Карточка #{i}</Card.Header>
          <Text size="sm" color="dimmed">
            Содержимое карточки номер {i}.
          </Text>
        </Card>
      ))}
    </div>
  ),
};
