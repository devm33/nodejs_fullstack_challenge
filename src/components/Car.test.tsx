import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Car, CarInput } from './Car';

describe('CarInput', () => {
  function setup(car: Car = {}) {
    const onChange = jest.fn();
    const onRemove = jest.fn();
    render(<CarInput
      car={car}
      index={0}
      onChange={onChange}
      onRemove={onRemove}
    />);
    return { onChange, onRemove };
  }

  it('renders input fields', () => {
    setup();

    expect(getVinInput()).toBeInTheDocument();
    expect(getYearInput()).toBeInTheDocument();
    expect(getMakeInput()).toBeInTheDocument();
    expect(getModelInput()).toBeInTheDocument();
  });

  it('renders input values', () => {
    setup({ vin: 'vin', year: '1999', make: 'ford', model: 't' });

    expect(getVinInput()).toHaveValue('vin');
    expect(getYearInput()).toHaveValue('1999');
    expect(getMakeInput()).toHaveValue('ford');
    expect(getModelInput()).toHaveValue('t');
  });

  it('removes given car', () => {
    const tempId = '1';
    const { onRemove } = setup({ tempId });
    screen.getByRole('button', { name: /remove/i }).click();
    expect(onRemove).toHaveBeenCalledWith({ tempId });
  });

  it('updates vin', () => {
    const { onChange } = setup();
    fireEvent.change(getVinInput(), { target: { value: 'test' } });
    expect(onChange).toHaveBeenCalledWith({ vin: 'test' });
  });

  it('updates year', () => {
    const { onChange } = setup();
    fireEvent.change(getYearInput(), { target: { value: 'test' } });
    expect(onChange).toHaveBeenCalledWith({ year: 'test' });
  });

  it('updates make', () => {
    const { onChange } = setup();
    fireEvent.change(getMakeInput(), { target: { value: 'test' } });
    expect(onChange).toHaveBeenCalledWith({ make: 'test' });
  });

  it('updates model', () => {
    const { onChange } = setup();
    fireEvent.change(getModelInput(), { target: { value: 'test' } });
    expect(onChange).toHaveBeenCalledWith({ model: 'test' });
  });
});

function getVinInput() {
  return screen.getByRole('textbox', { name: /vin/i });
}

function getYearInput() {
  return screen.getByRole('textbox', { name: /year/i });
}

function getMakeInput() {
  return screen.getByRole('textbox', { name: /make/i });
}

function getModelInput() {
  return screen.getByRole('textbox', { name: /model/i });
}