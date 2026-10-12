import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Accordion } from './Accordion';
import { Text } from '../Text/Text';
import { Stack } from '../Stack/Stack';

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 560 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['default', 'contained', 'filled', 'separated'],
    },
    chevronPosition: {
      control: 'inline-radio',
      options: ['left', 'right'],
    },
    multiple: { control: 'boolean' },
    loop: { control: 'boolean' },
    disableChevronRotation: { control: 'boolean' },
    transitionDuration: { control: 'number' },
  },
  args: {
    variant: 'default',
    chevronPosition: 'right',
    multiple: false,
    loop: true,
    disableChevronRotation: false,
    transitionDuration: 200,
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

const ITEMS = [
  {
    value: 'item-1',
    label: 'Что такое React?',
    description: 'Основы',
    content: 'React — это JavaScript-библиотека для создания пользовательских интерфейсов. Она позволяет описывать UI как набор компонентов и эффективно обновлять DOM при изменении состояния.',
  },
  {
    value: 'item-2',
    label: 'Что такое TypeScript?',
    description: 'Типизация',
    content: 'TypeScript — это надмножество JavaScript, добавляющее статическую типизацию. Он помогает находить ошибки на этапе компиляции и делает код более предсказуемым.',
  },
  {
    value: 'item-3',
    label: 'Что такое Vite?',
    description: 'Сборка',
    content: 'Vite — это сборщик и dev-сервер, использующий нативные ES-модули в браузере для мгновенной горячей замены модулей (HMR).',
  },
];

export const Default: Story = {
  render: (args) => (
    <Accordion {...args} defaultValue={['item-1']}>
      {ITEMS.map((item) => (
        <Accordion.Item key={item.value} value={item.value}>
          <Accordion.Control description={item.description}>{item.label}</Accordion.Control>
          <Accordion.Panel>
            <Text size="sm" color="dimmed">
              {item.content}
            </Text>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  ),
};

export const Contained: Story = {
  args: { variant: 'contained' },
  render: Default.render,
};

export const Filled: Story = {
  args: { variant: 'filled' },
  render: Default.render,
};

export const Separated: Story = {
  args: { variant: 'separated' },
  render: Default.render,
};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {(['default', 'contained', 'filled', 'separated'] as const).map((v) => (
        <div key={v}>
          <div style={{ fontSize: 12, color: 'var(--theme-muted)', marginBottom: 4 }}>variant={v}</div>
          <Accordion {...args} variant={v} defaultValue={['a']}>
            <Accordion.Item value="a">
              <Accordion.Control>Первая секция</Accordion.Control>
              <Accordion.Panel>
                <Text size="sm" color="dimmed">
                  Содержимое первой секции.
                </Text>
              </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item value="b">
              <Accordion.Control>Вторая секция</Accordion.Control>
              <Accordion.Panel>
                <Text size="sm" color="dimmed">
                  Содержимое второй секции.
                </Text>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </div>
      ))}
    </div>
  ),
};

export const Multiple: Story = {
  args: { multiple: true, defaultValue: ['item-1', 'item-2'] },
  render: Default.render,
};

export const ChevronLeft: Story = {
  args: { chevronPosition: 'left' },
  render: Default.render,
};

export const WithIcons: Story = {
  render: (args) => (
    <Accordion {...args}>
      <Accordion.Item value="1">
        <Accordion.Control icon={<span>⚛️</span>}>React</Accordion.Control>
        <Accordion.Panel>
          <Text size="sm" color="dimmed">
            Библиотека для UI.
          </Text>
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="2">
        <Accordion.Control icon={<span>📘</span>}>TypeScript</Accordion.Control>
        <Accordion.Panel>
          <Text size="sm" color="dimmed">
            Типизация для JavaScript.
          </Text>
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="3">
        <Accordion.Control icon={<span>⚡</span>}>Vite</Accordion.Control>
        <Accordion.Panel>
          <Text size="sm" color="dimmed">
            Молниеносный сборщик.
          </Text>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  ),
};

export const WithDisabledItem: Story = {
  render: (args) => (
    <Accordion {...args}>
      <Accordion.Item value="1">
        <Accordion.Control>Активная секция</Accordion.Control>
        <Accordion.Panel>
          <Text size="sm" color="dimmed">
            Её можно раскрыть.
          </Text>
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="2">
        <Accordion.Control disabled>Недоступная секция</Accordion.Control>
        <Accordion.Panel>
          <Text size="sm" color="dimmed">
            Не покажется.
          </Text>
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="3">
        <Accordion.Control>Третья секция</Accordion.Control>
        <Accordion.Panel>
          <Text size="sm" color="dimmed">
            Тоже работает.
          </Text>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  ),
};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState<string[]>(['item-1']);
    return (
      <Stack gap="md">
        <Accordion {...args} value={value} onChange={setValue}>
          {ITEMS.map((item) => (
            <Accordion.Item key={item.value} value={item.value}>
              <Accordion.Control>{item.label}</Accordion.Control>
              <Accordion.Panel>
                <Text size="sm" color="dimmed">
                  {item.content}
                </Text>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
        <Text size="sm" color="muted">
          Открыто: {value.join(', ') || '—'}
        </Text>
      </Stack>
    );
  },
};

export const CustomChevron: Story = {
  args: {
    chevron: <span style={{ fontSize: '1.2em' }}>▾</span>,
  },
  render: Default.render,
};

export const Faq: Story = {
  args: { variant: 'separated' },
  render: (args) => (
    <Accordion {...args}>
      {[
        {
          q: 'Как создать новую таблицу?',
          a: 'Нажмите кнопку «Создать таблицу» на главной странице — новая таблица появится в списке, и вы сразу сможете её открыть.',
        },
        {
          q: 'Как поделиться таблицей?',
          a: 'Откройте таблицу и нажмите «Поделиться» в правом верхнем углу. Можно пригласить участников по email или скопировать ссылку.',
        },
        {
          q: 'Можно ли экспортировать данные?',
          a: 'Да, в меню таблицы выберите «Экспорт» → формат (CSV, XLSX, JSON). Файл скачается автоматически.',
        },
        {
          q: 'Что делать, если не сохраняются изменения?',
          a: 'Проверьте соединение с интернетом. Данные сохраняются автоматически каждые несколько секунд. Если проблема остаётся — напишите в поддержку.',
        },
      ].map((item, i) => (
        <Accordion.Item key={i} value={`faq-${i}`}>
          <Accordion.Control>{item.q}</Accordion.Control>
          <Accordion.Panel>
            <Text size="sm" color="dimmed">
              {item.a}
            </Text>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  ),
};

export const SettingsPanel: Story = {
  render: (args) => (
    <Accordion {...args} variant="contained" multiple defaultValue={['general']}>
      <Accordion.Item value="general">
        <Accordion.Control icon={<span>⚙️</span>} description="Основные настройки">
          Общие
        </Accordion.Control>
        <Accordion.Panel>
          <Stack gap="sm">
            <Text size="sm">Язык: Русский</Text>
            <Text size="sm">Тема: Светлая</Text>
            <Text size="sm">Часовой пояс: UTC+3</Text>
          </Stack>
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="notifications">
        <Accordion.Control icon={<span>🔔</span>} description="Управление уведомлениями">
          Уведомления
        </Accordion.Control>
        <Accordion.Panel>
          <Stack gap="sm">
            <Text size="sm">Email: включено</Text>
            <Text size="sm">Push: выключено</Text>
            <Text size="sm">SMS: выключено</Text>
          </Stack>
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="security">
        <Accordion.Control icon={<span>🔒</span>} description="Безопасность аккаунта">
          Безопасность
        </Accordion.Control>
        <Accordion.Panel>
          <Stack gap="sm">
            <Text size="sm">Двухфакторная аутентификация: включена</Text>
            <Text size="sm">Последний вход: 15.10.2026, 10:30</Text>
          </Stack>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  ),
};
