// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Spinner from './Spinner';

/*test('sanity', () => {
  expect(true).toBe(false)
})*/

//does spinner render when 'on' prop is true?
/*test('spinner renders when on prop is true', () => {
  render((<Spinner on={true} />));
  const spinnerElement = screen.getByTestId(/Please wait.../i);
  expect(spinnerElement).toBeInTheDocument();
})

//test taht spinner does not render when 'on' prop is false 
test('spinner does not render when on prop is false', () => {
  render(<Spinner on={false} />);
  const spinnerElement = screen.queryByTestId(/Please wait.../i);
  expect(spinnerElement).not.toBeInTheDocument();
});*/

// Test that the spinner renders when `on` prop is true
test('spinner renders when on prop is true', () => {
  render(<Spinner on={true} />);
  const spinnerElement = screen.getByText(/Please wait.../i); // Use getByText with regex for case-insensitive match
  expect(spinnerElement).toBeInTheDocument();
});

// Test that the spinner does not render when `on` prop is false
test('spinner does not render when on prop is false', () => {
  render(<Spinner on={false} />);
  const spinnerElement = screen.queryByText(/Please wait.../i); // Use queryByText for potential absence
  expect(spinnerElement).not.toBeInTheDocument();
});

