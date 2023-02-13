import { dateForAge } from "@/lib/date";


export type Person = {
  id?: string;
  tempId?: string; // Only set for client-side created, not-yet saved cars.
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  relation?: string;
}

/** Returns whether two persons are equal by either id or tempId. */
export function equalPersons(a: Person, b: Person): boolean {
  if (a.tempId) {
    return a.tempId === b.tempId;
  }
  return a.id === b.id;
}

type PersonInputProps = {
  index: number;
  person: Person;
  onChange: (person: Person) => void;
  onRemove: (person: Person) => void;
}

export const PersonInput: React.FC<PersonInputProps> =
  ({ index, person, onChange, onRemove }) => {
    return (
      <div>
        Person {index + 1}:{' '}
        <button type="button" onClick={() => onRemove(person)}>Remove</button>
        <input
          onChange={(e) => onChange({ ...person, firstName: e.target.value })}
          placeholder="First name"
          aria-label="First name"
          type="text"
          value={person.firstName ?? ''}
        />
        <input
          onChange={(e) => onChange({ ...person, lastName: e.target.value })}
          placeholder="Last name"
          aria-label="Last name"
          type="text"
          value={person.lastName ?? ''}
        />
        <input
          onChange={(e) => onChange({ ...person, birthDate: e.target.value })}
          placeholder="Date of birth"
          aria-label="Date of birth"
          type="date"
          min="1900-01-01"
          max={dateForAge(16)}
          value={person.birthDate ?? ''}
        />
        <label htmlFor="relation">Relationship:</label>
        <select
          onChange={(e) => onChange({ ...person, relation: e.target.value })}
          id="relation"
          value={person.relation ?? ''}
        >
          <option value=""></option>
          <option value="spouse">Spouse</option>
          <option value="sibling">Sibling</option>
          <option value="parent">Parent</option>
          <option value="friend">Friend</option>
          <option value="other">Other</option>
        </select>
      </div>
    );
  };