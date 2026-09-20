import type { Meta, StoryObj } from '@storybook/react-vite';
import { HoverCard } from './HoverCard';
import { Avatar } from '../Avatar/Avatar';
import { Text } from '../Text/Text';
import { Title } from '../Title/Title';
import { Button } from '../Button/Button';
import { Stack } from '../Stack/Stack';
import { Group } from '../Group/Group';
import { Badge } from '../Badge/Badge';

const meta = {
  title: 'Components/HoverCard',
  component: HoverCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ padding: 80 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    position: {
      control: 'select',
      options: ['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'right'],
    },
    openDelay: { control: 'number' },
    closeDelay: { control: 'number' },
    offset: { control: 'number' },
    maw: { control: 'number' },
    disabled: { control: 'boolean' },
  },
  args: {
    content: <Text>Содержимое карточки</Text>,
    position: 'bottom',
    openDelay: 300,
    closeDelay: 150,
    offset: 8,
    maw: 320,
  },
} satisfies Meta<typeof HoverCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <HoverCard {...args}>
      <Button variant="default">Наведи на меня</Button>
    </HoverCard>
  ),
};

export const UserCard: Story = {
  render: (args) => (
    <HoverCard
      {...args}
      content={
        <Group gap="md" align="flex-start" style={{ minWidth: 240 }}>
          <Avatar name="Иван Петров" size="lg" color="accent" />
          <Stack gap="xs">
            <Title order={4} size="md">
              Иван Петров
            </Title>
            <Text size="sm" color="dimmed">
              Ведущий разработчик. Отвечает за UI-библиотеку и таблицу.
            </Text>
            <Group gap="xs" style={{ marginTop: 4 }}>
              <Badge size="xs" variant="accent">
                React
              </Badge>
              <Badge size="xs" variant="default">
                TypeScript
              </Badge>
            </Group>
          </Stack>
        </Group>
      }
    >
      <Text
        weight="medium"
        style={{
          cursor: 'pointer',
          textDecoration: 'underline dotted',
        }}
      >
        @ivan_petrov
      </Text>
    </HoverCard>
  ),
};

export const WithActions: Story = {
  render: (args) => (
    <HoverCard
      {...args}
      content={
        <Stack gap="sm" style={{ minWidth: 200 }}>
          <Text weight="medium">Моя таблица</Text>
          <Text size="sm" color="dimmed">
            Последнее изменение: 5 минут назад
          </Text>
          <Group gap="sm" style={{ marginTop: 4 }}>
            <Button size="xs" variant="accent">
              Открыть
            </Button>
            <Button size="xs" variant="default">
              Поделиться
            </Button>
          </Group>
        </Stack>
      }
    >
      <Button variant="accent">Информация о таблице</Button>
    </HoverCard>
  ),
};

export const Positions: Story = {
  render: (args) => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 24,
        placeItems: 'center',
        padding: 80,
      }}
    >
      {(['top-start', 'top', 'top-end', 'left', 'right', 'bottom-start', 'bottom', 'bottom-end'] as const).map((p) => (
        <HoverCard key={p} {...args} position={p} content={<Text size="sm">Позиция: {p}</Text>}>
          <Button size="sm" variant="default">
            {p}
          </Button>
        </HoverCard>
      ))}
    </div>
  ),
};

export const Interactive: Story = {
  render: (args) => (
    <HoverCard
      {...args}
      content={
        <Stack gap="xs" style={{ minWidth: 200 }}>
          <Text weight="medium">Интерактивная карточка</Text>
          <Text size="sm" color="dimmed">
            Наведи курсор на меня — я не исчезну.
          </Text>
          <Button size="xs" variant="accent" onClick={() => alert('Клик!')}>
            Нажми меня
          </Button>
        </Stack>
      }
    >
      <Button variant="default">Наведи и перейди внутрь</Button>
    </HoverCard>
  ),
};

export const LongContent: Story = {
  render: (args) => (
    <HoverCard
      {...args}
      maw={360}
      content={
        <Stack gap="sm">
          <Title order={4} size="md">
            Полное описание
          </Title>
          <Text size="sm" color="dimmed">
            Это длинное описание, которое не поместилось бы в Tooltip. HoverCard позволяет показать много текста, ссылки, кнопки и другие интерактивные элементы. Карточка остаётся открытой, пока вы
            взаимодействуете с ней.
          </Text>
          <Button size="xs" variant="accent">
            Читать далее…
          </Button>
        </Stack>
      }
    >
      <Text
        style={{
          cursor: 'help',
          textDecoration: 'underline',
        }}
      >
        Что это за таблица?
      </Text>
    </HoverCard>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <HoverCard {...args} content={<Text>Не показывается</Text>}>
      <Button variant="default">Отключена</Button>
    </HoverCard>
  ),
};

export const KeyboardAccessible: Story = {
  render: () => (
    <HoverCard content={<Text size="sm">Карточка открывается и по фокусу — Tab до меня.</Text>}>
      <Button variant="accent">Tab → фокус → карточка</Button>
    </HoverCard>
  ),
};
