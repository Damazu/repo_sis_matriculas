'use client'
import React from "react"
import { useEffect, useState } from "react"
import { MantineProvider, Badge } from '@mantine/core';
import LoginPage from "./LoginPage";
import '@mantine/core/styles.css';


function page() {

const [message, setMessage] = useState("Loading")
const [people, setPeople] = useState([])


  useEffect(() => {
    fetch("http://localhost:8080/api/home").then(
      (response) => response.json()
    ).then((data) =>{
      setMessage(data.message)
      setPeople(data.people)
    }

    )
  })

  return (
    <MantineProvider>
      <>
    <LoginPage></LoginPage>
      </>
    </MantineProvider>
  );

}

export default page