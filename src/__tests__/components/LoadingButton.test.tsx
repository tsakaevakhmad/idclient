import React from 'react';
import { render, screen } from '../utils/test-utils';
import { LoadingButton } from '@components/common';

describe('LoadingButton', () => {
  it('should render children when not loading', () => {
    render(<LoadingButton>Click Me</LoadingButton>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    render(<LoadingButton loading={true}>Click Me</LoadingButton>);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should be disabled when loading', () => {
    render(<LoadingButton loading={true}>Click Me</LoadingButton>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should show loading text if provided', () => {
    render(
      <LoadingButton loading={true} loadingText="Submitting...">
        Submit
      </LoadingButton>
    );
    expect(screen.getByText('Submitting...')).toBeInTheDocument();
  });
});
