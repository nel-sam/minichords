import { render } from '@testing-library/react-native';
import React from 'react';
import { McSeparator } from '../McSeparator/McSeparator';

describe('McSeparator component', () => {
  it('renders', () => {
    const { getByTestId } = render(<McSeparator />);
    const comp = getByTestId('mcseparator');
    expect(comp).toBeDefined();
  });
});
