import { Car, Person } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case 'GET':
      return handleGET(req, res);
    case 'PUT':
      return handlePUT(req, res);
    default:
      throw new Error(
        `The HTTP ${req.method} method is not supported at this route.`,
      );
  }
}

// GET /api/application/:id
async function handleGET(req: NextApiRequest, res: NextApiResponse<any>) {
  const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
  const application = await prisma.application.findUnique({ where: { id } });
  return res.json(application);
}

// PUT /api/application/:id
async function handlePUT(req: NextApiRequest, res: NextApiResponse<any>) {
  const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
  const { updated, ...application } = req.body;

  // Separate cars into created, updated, and deleted.
  const cars: Car[] = (req.body.cars ?? []).map((car: any) => {
    // Remove tempId, applicationId properties if present
    delete car.tempId;
    delete car.applicationId;
    // Convert year to number if present
    if (car.year) {
      car.year = Number(car.year);
    }
    return car;
  });
  const currentCars = await prisma.car.findMany({
    where: { applicationId: id },
  });
  const deletedCars = currentCars
    .filter((car) => !cars.some((c) => c.id === car.id))
    .map((car) => ({ id: car.id }));
  const createdCars = cars.filter((car) => !car.id);
  const updatedCars = cars.filter((car) => car.id);

  // Separate persons into created, updated, and deleted.
  const persons: Person[] = (req.body.persons ?? []).map((person: any) => {
    // Remove tempId, applicationId properties if present
    delete person.tempId;
    delete person.applicationId;
    return person;
  });
  const currentPersons = await prisma.person.findMany({
    where: { applicationId: id },
  });
  const deletedPersons = currentPersons
    .filter((person) => !persons.some((p) => p.id === person.id))
    .map((person) => ({ id: person.id }));
  const createdPersons = persons.filter((person) => !person.id);
  const updatedPersons = persons.filter((person) => person.id);

  // Update application and nested cars in database.
  const updatedApplication = await prisma.application.update({
    where: { id },
    data: {
      ...application,
      cars: {
        delete: deletedCars,
        create: createdCars,
        update: updatedCars.map((car) => ({
          data: car,
          where: { id: car.id },
        })),
      },
      persons: {
        delete: deletedPersons,
        create: createdPersons,
        update: updatedPersons.map((person) => ({
          data: person,
          where: { id: person.id },
        })),
      },
    },
    include: { cars: true, persons: true },
  });
  return res.json(updatedApplication);
}