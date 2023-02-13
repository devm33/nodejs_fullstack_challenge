import { yearsSince } from '@/lib/date';
import { Car, Person } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';

// POST /api/application/:id/validate
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
  const application = await prisma.application.findUnique({
    where: { id },
    include: { cars: true, persons: true },
  });

  // Check required fields are set on application.
  if (!application || !application.firstName || !application.lastName ||
    !application.birthDate || !application.addressStreet ||
    !application.addressCity || !application.addressState ||
    !application.addressZip) {
    return res.status(201).json({ valid: false });
  }

  // Check age is at least 16.
  if (yearsSince(application.birthDate) < 16) {
    return res.status(201).json({ valid: false });
  }

  // Check zip code is correct format.
  if (!/^\d{5}$/.test(application.addressZip)) {
    return res.status(201).json({ valid: false });
  }

  // Check between 1 and 3 cars, all valid.
  if (application.cars.length < 1 || application.cars.length > 3 ||
    !application.cars.every(validCar)) {
    return res.status(201).json({ valid: false });
  }

  // Check addition people are all valid.
  if (!application.persons.every(validPerson)) {
    return res.status(201).json({ valid: false });
  }

  return res.status(201).json({
    valid: true,
    price: Math.floor(Math.random() * 100000 + 10000) / 100,
  });
}

function validCar(car: Car): boolean {
  return !!car.make && !!car.model && !!car.vin && !!car.year &&
    car.year >= 1985 && car.year < new Date().getFullYear() + 1;
}

function validPerson(person: Person): boolean {
  return !!person.firstName && !!person.lastName && !!person.birthDate &&
    !!person.relation && yearsSince(person.birthDate) >= 16;
}
