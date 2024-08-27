'use client';

import { ScrollArea, NavLink } from '@mantine/core';
import { useState } from 'react';
import classes from './navbar.module.css';
import Link from 'next/link';

const mockdata = [
  { label: 'Home', link: '/' },
  { label: 'Secretario', link: '/secretario' },
  { label: 'Login', link: '/LoginPage' }
];

export default function Navbar({ opened }) {
  const [active, setActive] = useState(0);

  const links = mockdata.map((item, index) => (
    <div key={item.label}>
      <NavLink
        className={classes.navLink}
        label={item.label}
        component={Link}
        href={item.link}
        active={active === index}
        onClick={() => setActive(index)}
        color="#003399"
        style={{color: '#003399'}}
      />
    </div>
  ));

  if (!opened) {
    return null;
  }

  return (
    <nav className={classes.navbar}>
      <ScrollArea className={classes.links}>
        <div className={classes.linksInner}>{links}</div>
      </ScrollArea>
    </nav>
  );
}
