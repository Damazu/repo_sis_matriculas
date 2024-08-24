'use client'
import React from "react"
import { useEffect, useState } from "react"


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
    <>
    <div>{message}</div>
    <div>{people.map((person, index)=>(
        <div key={index}>
          {person}
        </div>
    ))
      }</div>
    </>
  )
}

export default page