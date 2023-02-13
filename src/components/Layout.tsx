import React, { ReactNode } from 'react';
import styles from '@/components/Layout.module.css';

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = (props) => (
  <div className={styles.layout}>{props.children}</div>
);

export default Layout;
