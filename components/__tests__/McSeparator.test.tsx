import { render } from '@testing-library/react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import { McSeparator } from '../McSeparator/McSeparator';

describe('McSeparator component', () => {
  it('renders', () => {
    const { getByTestId } = render(<McSeparator />);
    const comp = getByTestId('mcseparator');
    expect(comp).toBeDefined();
  });

  it('matches snapshot', () => {
    const tree = renderer.create(<McSeparator />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
