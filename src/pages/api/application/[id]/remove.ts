import { yearsSince } from '@/lib/date';
import { Car, Person } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';

// POST /api/application/:id/delete
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
  console.log('deleting ', id);
  await prisma.application.delete({ where: { id } });
  return res.status(201).json({ success: true });
}