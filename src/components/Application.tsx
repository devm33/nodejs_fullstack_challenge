import React, { useEffect, useRef, useState } from 'react';
import styles from '@/components/Application.module.css';
import { Car, CarInput, equalCars } from './Car';
import Router from 'next/router';
import { equalPersons, Person, PersonInput } from './Person';
import { dateForAge } from '@/lib/date';

export type Application = {
  id?: string;
  created?: Date;
  updated?: Date;
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  addressStreet?: string;
  addressCity?: string;
  addressState?: string;
  addressZip?: string;
  cars?: Car[];
  persons?: Person[];
}

type Props = {
  application: Application;
}

export const ApplicationForm: React.FC<Props> = (props) => {
  const [application, setApplication] = useState(props.application);
  const [saveMessage, setSaveMessage] = useState('');
  const saveMessageRef = useRef<NodeJS.Timeout | number | null>(null);
  const applicationEdited = useRef<boolean>(false);

  // Persists application data. Invoked from either form submit or effect hook.
  const submit = async (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    if (application.id) return; // Existing applications auto-saved on update.
    try {
      const response = await fetch(`/api/application`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(application),
      });
      const json = await response.json();
      await Router.push(json.resume);
    } catch (error) {
      console.error(error);
    }
  };

  // Helper to update application state data.
  const update = (updated: Partial<Application>) => {
    applicationEdited.current = true;
    setApplication({ ...application, ...updated });
  };

  // Creates a new car with a client-side temporary id.
  const addCar = () => {
    const tempId = crypto.randomUUID();
    update({ cars: [...(application.cars ?? []), { tempId }] });
  };

  // Handles input changes to a car.
  const updateCar = (car: Car) => {
    update({
      cars: (application.cars ?? []).map(c => equalCars(car, c) ? car : c),
    });
  };

  // Handles user removing a car.
  const removeCar = (car: Car) => {
    update({
      cars: (application.cars ?? []).filter(c => !equalCars(car, c)),
    });
  };

  // Creates a new person with a client-side temporary id.
  const addPerson = () => {
    const tempId = crypto.randomUUID();
    update({ persons: [...(application.persons ?? []), { tempId }] });
  };

  // Handles input changes to a person.
  const updatePerson = (person: Person) => {
    update({
      persons: (application.persons ?? [])
        .map(p => equalPersons(person, p) ? person : p),
    });
  };

  // Handles user removing a person.
  const removePerson = (person: Person) => {
    update({
      persons: (application.persons ?? [])
        .filter(p => !equalPersons(person, p)),
    });
  };

  // Save when application state is updated.
  useEffect(() => {
    // Don't autosave for new applications.
    if (!application.id) return;
    // Don't save on render until application changed.
    if (!applicationEdited.current) return;

    // Saves changes to application via PUT.
    const save = async () => {
      if (saveMessageRef.current) clearTimeout(saveMessageRef.current);
      setSaveMessage('Saving...');
      try {
        const response = await fetch(`/api/application/${application.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(application),
        });
        const json = await response.json();
        applicationEdited.current = false;
        setApplication(json);
        setSaveMessage('Saved');
        saveMessageRef.current = setTimeout(() => setSaveMessage(''), 1500);
      } catch (error) {
        setSaveMessage(`Error saving: ${error}`);
        console.error(error);
      }
    };

    save();
  }, [application]);

  return (
    <div className={styles.application} >
      <form onSubmit={submit}>
        <span className={styles.saveMessage}>{saveMessage}</span>
        <input
          onChange={(e) => update({ firstName: e.target.value })}
          placeholder="First name"
          type="text"
          value={application.firstName ?? ''}
        />
        <input
          onChange={(e) => update({ lastName: e.target.value })}
          placeholder="Last name"
          type="text"
          value={application.lastName ?? ''}
        />
        <label htmlFor="birthdate">Date of birth: </label>
        <input
          onChange={(e) => update({ birthDate: e.target.value })}
          placeholder="Date of birth"
          id="birthdate"
          type="date"
          min="1900-01-01"
          max={dateForAge(16)}
          value={application.birthDate ?? ''}
        />
        <div>
          <label>Address:</label>
          <input
            onChange={(e) => update({ addressStreet: e.target.value })}
            placeholder="Street"
            type="text"
            value={application.addressStreet ?? ''}
          />
          <input
            onChange={(e) => update({ addressCity: e.target.value })}
            placeholder="City"
            type="text"
            value={application.addressCity ?? ''}
          />
          <input
            onChange={(e) => update({ addressState: e.target.value })}
            placeholder="State"
            type="text"
            value={application.addressState ?? ''}
          />
          <input
            onChange={(e) => update({ addressZip: e.target.value })}
            placeholder="Zip code"
            type="text"
            pattern="\d{5}"
            maxLength={5}
            value={application.addressZip ?? ''}
          />
        </div>
        <div>
          <div className={styles.sectionLabel}>Cars:</div>
          {application.cars?.map((car, i) => (
            <CarInput
              key={car.id || car.tempId}
              index={i}
              car={car}
              onChange={updateCar}
              onRemove={removeCar}
            />
          ))}
          {(application.cars?.length ?? 0) < 3 &&
            <button type="button" onClick={addCar}>Add car</button>
          }
        </div>
        <div>
          <div className={styles.sectionLabel}>Additional people:</div>
          {application.persons?.map((person, i) => (
            <PersonInput
              key={person.id || person.tempId}
              index={i}
              person={person}
              onChange={updatePerson}
              onRemove={removePerson}
            />
          ))}
          <button type="button" onClick={addPerson}>Add person</button>
        </div>
        {!application.id && <input type="submit" value="Create" />}
      </form>
    </div>
  );
};