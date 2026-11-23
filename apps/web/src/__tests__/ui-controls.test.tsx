import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CustomSegmentedControl } from '../components/ui/CustomSegmentedControl';
import { CustomSwitch } from '../components/ui/CustomSwitch';
import { CustomSelect } from '../components/ui/CustomSelect';

describe('CustomSegmentedControl', () => {
  const options = [
    { value: 'sm', label: 'Small' },
    { value: 'md', label: 'Medium' },
    { value: 'lg', label: 'Large' },
  ];

  it('renders options and fires onChange when clicked', () => {
    const onChange = vi.fn();
    render(
      <CustomSegmentedControl
        label="Size Selection"
        value="md"
        onChange={onChange}
        options={options}
      />
    );

    expect(screen.getByText('Size Selection')).toBeTruthy();
    const smallOption = screen.getByText('Small');
    fireEvent.click(smallOption);
    expect(onChange).toHaveBeenCalledWith('sm');
  });
});

describe('CustomSwitch', () => {
  it('toggles checked state and displays label and description', () => {
    const onChange = vi.fn();
    render(
      <CustomSwitch
        checked={false}
        onChange={onChange}
        label="Show Balance"
        description="Display live wallet balance"
      />
    );

    expect(screen.getByText('Show Balance')).toBeTruthy();
    expect(screen.getByText('Display live wallet balance')).toBeTruthy();

    const switchBtn = screen.getByRole('switch');
    fireEvent.click(switchBtn);
    expect(onChange).toHaveBeenCalledWith(true);
  });
});

describe('CustomSelect', () => {
  const options = [
    { value: 'opt1', label: 'Option One', description: 'First option' },
    { value: 'opt2', label: 'Option Two', description: 'Second option' },
  ];

  it('opens options list on click and selects an item', () => {
    const onChange = vi.fn();
    render(
      <CustomSelect label="Select Choice" value="opt1" onChange={onChange} options={options} />
    );

    expect(screen.getByText('Select Choice')).toBeTruthy();
    expect(screen.getByText('Option One')).toBeTruthy();

    // Click trigger button to open menu
    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);

    // Option Two is now visible in menu
    const optionTwo = screen.getByText('Option Two');
    fireEvent.click(optionTwo);

    expect(onChange).toHaveBeenCalledWith('opt2');
  });
});
