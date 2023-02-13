import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { equalPersons, Person, PersonInput } from './Person';

describe('equalPersons', () => {
  it('determines equality based on ids', () => {
    expect(equalPersons({ id: '1', firstName: 't' }, { id: '1' })).toBe(true);
    expect(equalPersons({ id: '1', firstName: 't' }, { id: '2' })).toBe(false);
  });

  it('determines equality based on tempIds', () => {
    expect(equalPersons({ tempId: '1', firstName: 't' }, { tempId: '1' }))
      .toBe(true);
    expect(equalPersons({ tempId: '1', firstName: 't' }, { tempId: '2' }))
      .toBe(false);
  });
});

describe('PersonInput', () => {

  function setup(person: Person = {}) {
    const onChange = jest.fn();
    const onRemove = jest.fn();
    render(<PersonInput
      person={person}
      index={0}
      onChange={onChange}
      onRemove={onRemove}
    />);
    return { onChange, onRemove };
  }

  it('renders input fields', () => {
    setup();

    expect(getFirstNameInput()).toBeInTheDocument();
    expect(getLastNameInput()).toBeInTheDocument();
    expect(getBirthDateInput()).toBeInTheDocument();
    expect(getRelationshipInput()).toBeInTheDocument();
  });

  it('renders input values', () => {
    setup({
      firstName: 'first', lastName: 'last', birthDate: '2000-01-01',
      relation: 'spouse',
    });

    expect(getFirstNameInput()).toHaveValue('first');
    expect(getLastNameInput()).toHaveValue('last');
    expect(getBirthDateInput()).toHaveValue('2000-01-01');
    expect(getRelationshipInput()).toHaveValue('spouse');
  });

  it('removes given person', () => {
    const tempId = '1';
    const { onRemove } = setup({ tempId });
    screen.getByRole('button', { name: /remove/i }).click();
    expect(onRemove).toHaveBeenCalledWith({ tempId });
  });

  it('updates first name', () => {
    const { onChange } = setup();
    fireEvent.change(getFirstNameInput(), { target: { value: 'test' } });
    expect(onChange).toHaveBeenCalledWith({ firstName: 'test' });
  });

  it('updates last name', () => {
    const { onChange } = setup();
    fireEvent.change(getLastNameInput(), { target: { value: 'test' } });
    expect(onChange).toHaveBeenCalledWith({ lastName: 'test' });
  });

  it('updates date of birth', () => {
    const { onChange } = setup();
    fireEvent.change(getBirthDateInput(), { target: { value: '2000-01-01' } });
    expect(onChange).toHaveBeenCalledWith({ birthDate: '2000-01-01' });
  });

  it('updates relationship', () => {
    const { onChange } = setup();
    fireEvent.change(getRelationshipInput(), { target: { value: 'parent' } });
    expect(onChange).toHaveBeenCalledWith({ relation: 'parent' });
  });
});

function getFirstNameInput() {
  return screen.getByRole('textbox', { name: /first name/i });
}

function getLastNameInput() {
  return screen.getByRole('textbox', { name: /last name/i });
}

function getBirthDateInput() {
  return screen.getByLabelText(/date of birth/i);
}

function getRelationshipInput() {
  return screen.getByRole('combobox', { name: /relationship/i });
}