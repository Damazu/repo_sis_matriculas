'use client'

import React from 'react';
import { AppShell } from '@mantine/core';
import Header from '../Header/Header';
import Navbar from '../navbar/navbar';

const Layout = ({ children }) => {
    const [open, setOpened] = React.useState(false);
  return (
    <AppShell
      header={{ height: 80 }}
      navbar={{ width: 300, breakpoint: 'sm'}}
      padding="md"
      footer={{ height: 50 }}
    >
      <AppShell.Header style={{zIndex: 1010}}>
          <Header open={open} setOpened={setOpened} />
      </AppShell.Header>

      {open && (
        <AppShell.Navbar h={500} style={{backgroundColor: "#F2F2F2", zIndex: 1010}}>
          <Navbar opened={open} />
        </AppShell.Navbar>
      )}

      <AppShell.Main pl={16}>
        <main>{children}</main>
      </AppShell.Main>
    </AppShell>
  );
};

export default Layout;