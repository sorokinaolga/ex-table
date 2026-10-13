import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Collapse } from './Collapse';
import { Button } from '../Button/Button';
import { Stack } from '../Stack/Stack';
import { Text } from '../Text/Text';

const meta = {
  title: 'Components/Collapse',
  component: Collapse,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 480 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    in: { control: 'boolean' },
    animateOpacity: { control: 'boolean' },
    transitionDuration: { control: 'number' },
    keepMounted: { control: 'boolean' },
  },
  args: {
    in: false,
    animateOpacity: true,
    transitionDuration: 200,
    keepMounted: false,
  },
} satisfies Meta<typeof Collapse>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template = (args: React.ComponentProps<typeof Collapse>) => {
  const [opened, setOpened] = useState(false);
  return (
    <Stack gap="md">
      <Button variant="accent" onClick={() => setOpened((o) => !o)}>
        {opened ? 'Скрыть' : 'Показать'}
      </Button>
      <Collapse {...args} in={opened}>
        <div
          style={{
            padding: 16,
            borderRadius: 8,
            background: 'var(--theme-surface-hover)',
          }}
        >
          <Text weight="medium" style={{ marginBottom: 8 }}>
            Скрытый контент
          </Text>
          <Text size="sm" color="dimmed">
            Этот блок плавно появляется и исчезает. Высота анимируется без измерения scrollHeight — через grid-template-rows.
          </Text>
        </div>
      </Collapse>
    </Stack>
  );
};

export const Default: Story = {
  render: (args) => <Template {...args} />,
};

export const WithoutOpacity: Story = {
  args: { animateOpacity: false },
  render: (args) => <Template {...args} />,
};

export const SlowAnimation: Story = {
  args: { transitionDuration: 600 },
  render: (args) => <Template {...args} />,
};

export const FastAnimation: Story = {
  args: { transitionDuration: 100 },
  render: (args) => <Template {...args} />,
};

export const KeepMounted: Story = {
  args: { keepMounted: true },
  render: (args) => <Template {...args} />,
};

export const ShowMoreExample: Story = {
  render: () => {
    const [opened, setOpened] = useState(false);
    return (
      <div>
        <Text size="sm">
          React — это JavaScript-библиотека для создания пользовательских интерфейсов. Она позволяет описывать UI как набор компонентов и эффективно обновлять DOM при изменении состояния.
        </Text>
        <Collapse in={opened} style={{ marginTop: 8 }}>
          <Text size="sm" color="dimmed">
            React был создан в Facebook в 2013 году и с тех пор стал одним из самых популярных инструментов для веб-разработки. Его ключевая идея — декларативное описание интерфейса, где вы говорите
            «что» должно быть на экране, а не «как» это сделать. Виртуальный DOM и эффективный алгоритм сравнения делают обновления быстрыми и предсказуемыми.
          </Text>
        </Collapse>
        <Button variant="accent" size="sm" onClick={() => setOpened((o) => !o)} style={{ marginTop: 8 }}>
          {opened ? 'Свернуть' : 'Показать полностью'}
        </Button>
      </div>
    );
  },
};

export const MultipleCollapses: Story = {
  render: () => {
    const [opened, setOpened] = useState<Record<string, boolean>>({
      first: false,
      second: false,
      third: false,
    });

    const toggle = (key: string) => setOpened((o) => ({ ...o, [key]: !o[key] }));

    const items = [
      { key: 'first', label: 'Что такое React?', content: 'React — это библиотека для UI.' },
      { key: 'second', label: 'Что такое TypeScript?', content: 'TypeScript — это типизация для JS.' },
      { key: 'third', label: 'Что такое Vite?', content: 'Vite — это быстрый сборщик.' },
    ];

    return (
      <Stack gap="sm">
        {items.map((item) => (
          <div key={item.key}>
            <Button variant="accent" onClick={() => toggle(item.key)} fullWidth>
              {opened[item.key] ? '▾' : '▸'} {item.label}
            </Button>
            <Collapse in={opened[item.key]}>
              <div
                style={{
                  padding: '8px 12px 12px',
                  fontSize: 14,
                  color: 'var(--theme-fg-subtle)',
                }}
              >
                {item.content}
              </div>
            </Collapse>
          </div>
        ))}
      </Stack>
    );
  },
};

export const OnTransitionEnd: Story = {
  render: () => {
    const [opened, setOpened] = useState(false);
    const [status, setStatus] = useState('—');
    return (
      <Stack gap="md">
        <Button variant="accent" onClick={() => setOpened((o) => !o)}>
          {opened ? 'Скрыть' : 'Показать'}
        </Button>
        <Text size="sm" color="muted">
          Последнее событие: {status}
        </Text>
        <Collapse in={opened} onTransitionEnd={() => setStatus(opened ? 'открыто' : 'закрыто')}>
          <div
            style={{
              padding: 16,
              borderRadius: 8,
              background: 'var(--theme-surface-hover)',
            }}
          >
            <Text size="sm">Контент появился.</Text>
          </div>
        </Collapse>
      </Stack>
    );
  },
};
