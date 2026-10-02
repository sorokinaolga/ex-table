import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Rating } from './Rating';
import { Text } from '../Text/Text';

const meta = {
  title: 'Components/Rating',
  component: Rating,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    count: { control: { type: 'number', min: 3, max: 10 } },
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    color: {
      control: 'select',
      options: ['accent', 'warning', 'error', 'default'],
    },
    fractions: { control: { type: 'number', min: 1, max: 4 } },
    readOnly: { control: 'boolean' },
    disabled: { control: 'boolean' },
    highlightSelectedOnly: { control: 'boolean' },
    defaultValue: { control: 'number' },
  },
  args: {
    count: 5,
    size: 'md',
    color: 'accent',
    fractions: 1,
    readOnly: false,
    disabled: false,
    highlightSelectedOnly: false,
    defaultValue: 3,
  },
} satisfies Meta<typeof Rating>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: { defaultValue: 0 },
};

export const Full: Story = {
  args: { defaultValue: 5 },
};

export const Count10: Story = {
  args: { count: 10, defaultValue: 7, size: 'sm' },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Rating {...args} size="xs" />
      <Rating {...args} size="sm" />
      <Rating {...args} size="md" />
      <Rating {...args} size="lg" />
      <Rating {...args} size="xl" />
    </div>
  ),
};

export const Colors: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Rating {...args} color="accent" />
      <Rating {...args} color="warning" />
      <Rating {...args} color="error" />
      <Rating {...args} color="default" />
    </div>
  ),
};

export const Fractions: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Rating {...args} fractions={1} defaultValue={3} />
      <Rating {...args} fractions={2} defaultValue={3.5} />
      <Rating {...args} fractions={3} defaultValue={3.7} />
      <Rating {...args} fractions={4} defaultValue={3.25} />
    </div>
  ),
};

export const ReadOnly: Story = {
  args: { readOnly: true, defaultValue: 4 },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 3 },
};

export const HighlightSelectedOnly: Story = {
  args: {
    highlightSelectedOnly: true,
    defaultValue: 3,
    count: 5,
  },
};

export const CustomIcon: Story = {
  args: {
    defaultValue: 3,
    icon: <span style={{ fontSize: '1.2em' }}>❤️</span>,
    emptyIcon: <span style={{ fontSize: '1.2em', opacity: 0.2 }}>🤍</span>,
  },
};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState(3);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Rating {...args} value={value} onChange={setValue} onHover={() => {}} />
        <Text size="sm" color="muted">
          Оценка: {value} из {args.count ?? 5}
        </Text>
      </div>
    );
  },
};

export const ReviewExample: Story = {
  render: () => {
    const [rating, setRating] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    return (
      <div
        style={{
          width: 320,
          padding: 20,
          borderRadius: 12,
          background: 'var(--theme-surface)',
          border: '1px solid var(--theme-border-subtle)',
        }}
      >
        <Text weight="semibold" size="lg">
          Оцените продукт
        </Text>
        <Text size="sm" color="muted" style={{ marginTop: 4, marginBottom: 12 }}>
          Ваш отзыв помогает нам стать лучше
        </Text>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0' }}>
          <Rating
            size="xl"
            value={rating}
            onChange={(v) => {
              setRating(v);
              setSubmitted(false);
            }}
          />
        </div>
        <Text size="sm" color={rating > 0 ? 'default' : 'muted'} style={{ textAlign: 'center', marginBottom: 12 }}>
          {rating === 0 && 'Нажмите на звезду'}
          {rating === 1 && 'Ужасно 😞'}
          {rating === 2 && 'Плохо 😕'}
          {rating === 3 && 'Нормально 😐'}
          {rating === 4 && 'Хорошо 🙂'}
          {rating === 5 && 'Отлично! 🤩'}
        </Text>
        <button
          type="button"
          disabled={rating === 0}
          onClick={() => setSubmitted(true)}
          style={{
            width: '100%',
            padding: '10px 16px',
            borderRadius: 6,
            border: 'none',
            background: rating > 0 ? 'var(--theme-accent)' : 'var(--theme-surface-hover)',
            color: rating > 0 ? 'var(--theme-accent-fg)' : 'var(--theme-muted)',
            fontWeight: 600,
            cursor: rating > 0 ? 'pointer' : 'not-allowed',
          }}
        >
          {submitted ? '✓ Спасибо!' : 'Отправить отзыв'}
        </button>
      </div>
    );
  },
};

export const ProductCard: Story = {
  render: () => (
    <div
      style={{
        width: 280,
        padding: 16,
        borderRadius: 8,
        background: 'var(--theme-surface)',
        border: '1px solid var(--theme-border-subtle)',
      }}
    >
      <Text weight="semibold">Наушники Sony WH-1000XM5</Text>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
        <Rating readOnly fractions={2} defaultValue={4.5} size="sm" />
        <Text size="sm" color="muted">
          4.5 · 1 234 отзыва
        </Text>
      </div>
      <Text size="lg" weight="semibold" style={{ marginTop: 12 }}>
        29 990 ₽
      </Text>
    </div>
  ),
};

export const Stats: Story = {
  render: () => {
    const stats = [
      { stars: 5, count: 850 },
      { stars: 4, count: 320 },
      { stars: 3, count: 120 },
      { stars: 2, count: 40 },
      { stars: 1, count: 15 },
    ];
    const total = stats.reduce((acc, s) => acc + s.count, 0);
    return (
      <div style={{ width: 320 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Text size="xl" weight="bold">
            4.7
          </Text>
          <div>
            <Rating readOnly fractions={2} defaultValue={4.7} size="sm" />
            <Text size="xs" color="muted">
              {total} отзывов
            </Text>
          </div>
        </div>
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {stats.map((s) => (
            <div key={s.stars} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Text size="xs" style={{ width: 12 }}>
                {s.stars}
              </Text>
              <div
                style={{
                  flex: 1,
                  height: 6,
                  borderRadius: 3,
                  background: 'var(--theme-surface-hover)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${(s.count / total) * 100}%`,
                    background: 'var(--theme-accent)',
                  }}
                />
              </div>
              <Text size="xs" color="muted" style={{ width: 36, textAlign: 'right' }}>
                {s.count}
              </Text>
            </div>
          ))}
        </div>
      </div>
    );
  },
};
