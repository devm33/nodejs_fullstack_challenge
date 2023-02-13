import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

// POST /api/application
// Optional fields: birthDate, addressStreet, addressCity, addressState,
// addressZip, cars
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { cars, persons,  ...application } = req.body;
  const createdCars = (cars ?? []).map((car: any) => {
    delete car.tempId;
    return car;
  });
  const createdPersons = (persons ?? []).map((person: any) => {
    delete person.tempId;
    return person;
  });
  const result = await prisma.application.create({
    data: {
      ...application,
      cars: { create: createdCars },
      persons: { create: createdPersons},
    },
  });
  return res.status(201).json({ resume: `/application/${result.id}` });
}
