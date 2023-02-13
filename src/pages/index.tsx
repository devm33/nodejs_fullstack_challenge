import Layout from '../components/Layout';
import Link from 'next/link';
import React from 'react';
import prisma from '../lib/prisma';
import styles from '@/pages/index.module.css';
import { Application, ApplicationForm } from '../components/Application';
import { GetServerSideProps } from 'next';

type Props = {
  applications: Application[];
}

const HomePage: React.FC<Props> = (props) => {
  return (
    <Layout>
      <div>
        <h1>Insurance Application</h1>
        <main>
          <h2 className={styles.createHeader}>Create application</h2>
          <ApplicationForm application={{}} />
          <h2>Existing applications</h2>
          {props.applications.map((application) => (
            <div key={application.id}>
              <Link href={`/application/${application.id}`}>
                {application.firstName ?
                  `${application.firstName} ${application.lastName ?? ''}` :
                  application.id}
              </Link>
            </div>
          ))}
        </main>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const applications = await prisma.application.findMany();
  return {
    props: { applications },
  };
};

export default HomePage;
