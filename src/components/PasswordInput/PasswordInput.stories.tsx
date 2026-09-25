import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { PasswordInput } from './PasswordInput';

const meta = {
  title: 'Components/PasswordInput',
  component: PasswordInput,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md'] },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    withAsterisk: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    visible: { control: 'boolean' },
    defaultVisible: { control: 'boolean' },
    label: { control: 'text' },
    description: { control: 'text' },
    error: { control: 'text' },
    placeholder: { control: 'text' },
  },
  args: {
    label: 'Пароль',
    placeholder: '••••••••',
    size: 'md',
    fullWidth: true,
    defaultVisible: false,
  },
} satisfies Meta<typeof PasswordInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDescription: Story = {
  args: { description: 'Минимум 8 символов' },
};

export const WithError: Story = {
  args: { error: 'Пароль слишком короткий' },
};

export const WithAsterisk: Story = {
  args: { withAsterisk: true },
};

export const DefaultVisible: Story = {
  args: {
    defaultVisible: true,
    defaultValue: 'qwerty123',
    label: 'Виден по умолчанию',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: 'password',
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <PasswordInput {...args} size="xs" label="xs" />
      <PasswordInput {...args} size="sm" label="sm" />
      <PasswordInput {...args} size="md" label="md" />
    </div>
  ),
};

export const Controlled: Story = {
  render: (args) => {
    const [visible, setVisible] = useState(false);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <PasswordInput {...args} visible={visible} onVisibleChange={setVisible} defaultValue="secret123" />
        <div style={{ fontSize: 13, color: 'var(--theme-muted)' }}>Пароль {visible ? 'виден' : 'скрыт'}</div>
      </div>
    );
  },
};

export const CustomIcons: Story = {
  args: {
    visibleIcon: <span>👁️</span>,
    hiddenIcon: <span>🙈</span>,
    defaultValue: 'secret',
  },
};

export const LoginForm: Story = {
  render: () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const next: typeof errors = {};
      if (!email) next.email = 'Введите email';
      if (!password) next.password = 'Введите пароль';
      else if (password.length < 6) next.password = 'Минимум 6 символов';
      setErrors(next);
      if (Object.keys(next).length === 0) {
        alert('Успешный вход');
      }
    };

    return (
      <form onSubmit={handleSubmit} style={{ width: 320 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <PasswordInput label="Email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} withAsterisk />
          <PasswordInput label="Пароль" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} withAsterisk />
          <button
            type="submit"
            style={{
              padding: '10px 16px',
              borderRadius: 6,
              border: 'none',
              background: 'var(--theme-accent)',
              color: 'var(--theme-accent-fg)',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Войти
          </button>
        </div>
      </form>
    );
  },
};

export const ChangePassword: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <div
        style={{
          padding: 16,
          borderRadius: 8,
          border: '1px solid var(--theme-border-subtle)',
          background: 'var(--theme-surface)',
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: 12 }}>Смена пароля</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <PasswordInput label="Текущий пароль" placeholder="••••••••" withAsterisk />
          <PasswordInput label="Новый пароль" placeholder="••••••••" description="Минимум 8 символов, заглавная, цифра" withAsterisk />
          <PasswordInput label="Повторите пароль" placeholder="••••••••" withAsterisk />
        </div>
      </div>
    </div>
  ),
};
