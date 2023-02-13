
export type Car = {
  id?: string;
  tempId?: string; // Only set for client-side created, not-yet saved cars.
  vin?: string;
  year?: string;
  make?: string;
  model?: string;
};

/** Returns whether two cars are equal by either id or tempId. */
export function equalCars(a: Car, b: Car): boolean {
  if (a.tempId) {
    return a.tempId === b.tempId;
  }
  return a.id === b.id;
}

type CarInputProps = {
  index: number;
  car: Car;
  onChange: (car: Car) => void;
  onRemove: (car: Car) => void;
}

export const CarInput: React.FC<CarInputProps> =
  ({ index, car, onChange, onRemove }) => {
    return (
      <div>
        Car {index + 1}:{' '}
        <button type="button" onClick={() => onRemove(car)}>Remove</button>
        <input
          onChange={(e) => onChange({ ...car, vin: e.target.value })}
          placeholder="VIN"
          aria-label="VIN"
          type="text"
          value={car.vin ?? ''}
        />
        <input
          onChange={(e) => onChange({ ...car, year: e.target.value })}
          placeholder="Year"
          aria-label="Year"
          type="text"
          pattern="\d{4}"
          value={car.year ?? ''}
        />
        <input
          onChange={(e) => onChange({ ...car, make: e.target.value })}
          placeholder="Make"
          aria-label="Make"
          type="text"
          value={car.make ?? ''}
        />
        <input
          onChange={(e) => onChange({ ...car, model: e.target.value })}
          placeholder="Model"
          aria-label="Model"
          type="text"
          value={car.model ?? ''}
        />
      </div>
    );
  };