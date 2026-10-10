import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Stepper } from './Stepper';
import { Button } from '../Button/Button';
import { Group } from '../Group/Group';
import { Stack } from '../Stack/Stack';
import { Text } from '../Text/Text';

const meta = {
  title: 'Components/Stepper',
  component: Stepper,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 600, padding: 24 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
    },
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    color: {
      control: 'select',
      options: ['accent', 'warning', 'error', 'default'],
    },
    allowNextStepsSelect: { control: 'boolean' },
  },
  args: {
    active: 1,
    orientation: 'horizontal',
    size: 'md',
    color: 'accent',
    allowNextStepsSelect: true,
    children: null as never,
  },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Stepper {...args}>
      <Stepper.Step label="Аккаунт" description="Создание аккаунта" />
      <Stepper.Step label="Профиль" description="Заполнение профиля" />
      <Stepper.Step label="Готово" description="Проверка данных" />
    </Stepper>
  ),
};

export const WithCallback: Story = {
  render: (args) => {
    const [active, setActive] = useState(1);
    return (
      <Stack gap="lg">
        <Stepper {...args} active={active} onStepClick={setActive}>
          <Stepper.Step label="Аккаунт" description="Создание аккаунта" />
          <Stepper.Step label="Профиль" description="Заполнение профиля" />
          <Stepper.Step label="Готово" description="Проверка данных" />
        </Stepper>
        <Text size="sm" color="muted">
          Активный шаг: {active}
        </Text>
      </Stack>
    );
  },
};

export const Vertical: Story = {
  args: { orientation: 'vertical', active: 1 },
  render: (args) => (
    <Stepper {...args}>
      <Stepper.Step label="Регистрация" description="Создайте аккаунт или войдите" />
      <Stepper.Step label="Подтверждение" description="Подтвердите email" />
      <Stepper.Step label="Профиль" description="Заполните информацию о себе" />
      <Stepper.Step label="Готово" description="Начните работу с приложением" />
    </Stepper>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <Stack gap="xl">
      {(['xs', 'sm', 'md', 'lg'] as const).map((s) => (
        <div key={s}>
          <Text size="xs" color="muted" style={{ marginBottom: 8 }}>
            size={s}
          </Text>
          <Stepper {...args} size={s} active={1}>
            <Stepper.Step label="Первый" />
            <Stepper.Step label="Второй" />
            <Stepper.Step label="Третий" />
          </Stepper>
        </div>
      ))}
    </Stack>
  ),
};

export const Colors: Story = {
  render: (args) => (
    <Stack gap="xl">
      {(['accent', 'warning', 'error', 'default'] as const).map((c) => (
        <div key={c}>
          <Text size="xs" color="muted" style={{ marginBottom: 8 }}>
            color={c}
          </Text>
          <Stepper {...args} color={c} active={1}>
            <Stepper.Step label="Первый" />
            <Stepper.Step label="Второй" />
            <Stepper.Step label="Третий" />
          </Stepper>
        </div>
      ))}
    </Stack>
  ),
};

export const WithError: Story = {
  render: (args) => (
    <Stepper {...args} active={1}>
      <Stepper.Step label="Аккаунт" />
      <Stepper.Step label="Оплата" hasError />
      <Stepper.Step label="Готово" />
    </Stepper>
  ),
};

export const WithDisabledStep: Story = {
  render: (args) => (
    <Stepper {...args} active={0}>
      <Stepper.Step label="Первый" />
      <Stepper.Step label="Второй" disabled />
      <Stepper.Step label="Третий" />
    </Stepper>
  ),
};

export const WithIcons: Story = {
  render: (args) => (
    <Stepper {...args} active={1}>
      <Stepper.Step label="Аккаунт" icon={<span>👤</span>} />
      <Stepper.Step label="Оплата" icon={<span>💳</span>} />
      <Stepper.Step label="Доставка" icon={<span>📦</span>} />
      <Stepper.Step label="Готово" icon={<span>🎉</span>} />
    </Stepper>
  ),
};

export const OnlyBack: Story = {
  args: { allowNextStepsSelect: false, active: 2 },
  render: (args) => (
    <Stepper {...args}>
      <Stepper.Step label="Первый" />
      <Stepper.Step label="Второй" />
      <Stepper.Step label="Третий" />
      <Stepper.Step label="Четвёртый" />
    </Stepper>
  ),
};

export const FormWizard: Story = {
  render: () => {
    const [active, setActive] = useState(0);

    const next = () => setActive((a) => Math.min(a + 1, 3));
    const prev = () => setActive((a) => Math.max(a - 1, 0));

    return (
      <Stack gap="xl">
        <Stepper active={active} onStepClick={setActive} allowNextStepsSelect={false}>
          <Stepper.Step label="Аккаунт" description="Email и пароль" />
          <Stepper.Step label="Профиль" description="Имя и фото" />
          <Stepper.Step label="Оплата" description="Способ оплаты" />
          <Stepper.Step label="Готово" description="Подтверждение" />
        </Stepper>

        <div
          style={{
            padding: 20,
            borderRadius: 8,
            border: '1px solid var(--theme-border-subtle)',
            background: 'var(--theme-surface)',
            minHeight: 120,
          }}
        >
          <Text weight="medium">Шаг {active + 1}</Text>
          <Text size="sm" color="muted" style={{ marginTop: 4 }}>
            {active === 0 && 'Введите email и пароль для создания аккаунта.'}
            {active === 1 && 'Расскажите о себе: имя, фамилия, фото.'}
            {active === 2 && 'Выберите способ оплаты.'}
            {active === 3 && 'Проверьте данные и завершите регистрацию.'}
          </Text>
        </div>

        <Group justify="space-between">
          <Button variant="default" onClick={prev} disabled={active === 0}>
            Назад
          </Button>
          {active < 3 ? (
            <Button variant="accent" onClick={next}>
              Далее
            </Button>
          ) : (
            <Button variant="accent" onClick={() => alert('Готово!')}>
              Завершить
            </Button>
          )}
        </Group>
      </Stack>
    );
  },
};

export const VerticalWizard: Story = {
  render: () => {
    const [active, setActive] = useState(0);
    const steps = [
      { label: 'Регистрация', description: 'Создайте аккаунт' },
      { label: 'Подтверждение', description: 'Подтвердите email' },
      { label: 'Настройка', description: 'Настройте профиль' },
      { label: 'Готово', description: 'Начните работу' },
    ];

    return (
      <Stack gap="lg">
        <Stepper active={active} onStepClick={setActive} orientation="vertical">
          {steps.map((s) => (
            <Stepper.Step key={s.label} label={s.label} description={s.description} />
          ))}
        </Stepper>
        <Group gap="sm">
          <Button variant="default" size="sm" onClick={() => setActive((a) => Math.max(0, a - 1))} disabled={active === 0}>
            Назад
          </Button>
          <Button variant="accent" size="sm" onClick={() => setActive((a) => Math.min(steps.length - 1, a + 1))} disabled={active === steps.length - 1}>
            Далее
          </Button>
        </Group>
      </Stack>
    );
  },
};

export const OrderTracking: Story = {
  render: () => (
    <Stepper active={2} orientation="vertical" size="sm">
      <Stepper.Step label="Заказ оформлен" description="15 октября, 10:30" />
      <Stepper.Step label="Оплачен" description="15 октября, 10:35" />
      <Stepper.Step label="Собирается" description="15 октября, 14:00" />
      <Stepper.Step label="Передан курьеру" description="Ожидается" disabled />
      <Stepper.Step label="Доставлен" description="Ожидается" disabled />
    </Stepper>
  ),
};
