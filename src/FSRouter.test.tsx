import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { FSRouter } from './FSRouter';

// Mock components
const Home = () => <div>Home</div>;
const About = () => <div>About</div>;
const User = () => <div>User</div>;

const routes = {
  './pages/index.tsx': () => Promise.resolve({ default: Home }),
  './pages/about.tsx': () => Promise.resolve({ default: About }),
  './pages/users/[id].tsx': () => Promise.resolve({ default: User }),
};

describe('FSRouter', () => {
  it('should render the correct component for a static route', async () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <FSRouter routes={routes} />
      </MemoryRouter>
    );
    expect(await screen.findByText('About')).toBeInTheDocument();
  });

  it('should render the correct component for the root route', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <FSRouter routes={routes} />
      </MemoryRouter>
    );
    expect(await screen.findByText('Home')).toBeInTheDocument();
  });

  it('should render the correct component for a dynamic route', async () => {
    render(
      <MemoryRouter initialEntries={['/users/123']}>
        <FSRouter routes={routes} />
      </MemoryRouter>
    );
    expect(await screen.findByText('User')).toBeInTheDocument();
  });
});