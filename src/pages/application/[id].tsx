import Layout from '../../components/Layout';
import Link from 'next/link';
import React, { useState } from 'react';
import prisma from '../../lib/prisma';
import styles from '@/pages/application/id.module.css';
import { Application, ApplicationForm } from '../../components/Application';
import { GetServerSideProps } from 'next';
import Router from 'next/router';

const USD_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const ApplicationPage: React.FC<Application> = (props) => {
  const [validationResponse, setValidationResponse] = useState('');

  async function validate() {
    const response = await fetch(`/api/application/${props.id}/validate`, {
      method: 'POST',
    });
    const json = await response.json();
    if (json.valid) {
      const price = USD_FORMATTER.format(json.price);
      setValidationResponse(`Valid application, price ${price}`);
    } else {
      setValidationResponse('Invalid application');
    }
  }

  async function remove() {
    try {
      await fetch(`/api/application/${props.id}/remove`, { method: 'POST' });
      await Router.push('/');
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Layout>
      <div>
        <h1>Insurance Application</h1>
        <div className={styles.nav}>
          <Link href="/">&larr; Back</Link>
        </div>
        <button onClick={remove}>&#128465; Delete</button>{' '}
        <button onClick={validate}>Validate</button>{' '}
        <span>{validationResponse}</span>
        <ApplicationForm application={props} />
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const idParam = context.params?.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;
  const application = await prisma.application.findUnique({
    where: { id },
    include: { cars: true, persons: true },
  });
  return { props: { ...application } };
};

export default ApplicationPage;