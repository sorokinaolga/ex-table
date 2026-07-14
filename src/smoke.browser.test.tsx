import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';

describe('Browser Mode smoke test', () => {
  it('renders a div and checks text', async () => {
    const screen = await render(<div>Hello, Browser Mode</div>);
    await expect.element(screen.getByText('Hello, Browser Mode')).toBeVisible();
  });
});
