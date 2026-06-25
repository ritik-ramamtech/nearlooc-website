"use client"
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function RootPage() {
  const [authenticated, setAuthenticated] =useState(false);

useEffect(() => {

const username=window.prompt("Enter Username");

const password=window.prompt("Enter Password");

if (

username==="admin"&&

password==="123456"

    ) {

setAuthenticated(true);

    } else {

alert("Access Denied");

    }

  }, []);

if (!authenticated) {

return<h1>Access Denied</h1>;

  }
 
  redirect("/home");
}
