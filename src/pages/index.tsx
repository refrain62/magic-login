import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import React from "react"
import { UserContext, USERACTION_TYPES } from "@/context/user-context"
import { useRouter } from "next/router"
import { magicLogout } from "@/lib/magic"

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const {user, dispatch} = React.useContext(UserContext)
  const router = useRouter()
  const handleLoginButtonClicked = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    router.push("/login")
  }

  const handleLogoutButtonClicked = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    try {
      await magicLogout()
      dispatch({
          type: USERACTION_TYPES.LOG_OUT,
          user: null
      })
    } catch (error) {
        console.log(error)
    }
  }

  React.useEffect(() => {
    const loginButton = document.getElementById(USERACTION_TYPES.LOG_IN)as HTMLButtonElement
    const logoutButton = document.getElementById(USERACTION_TYPES.LOG_OUT) as HTMLButtonElement

    if (user === null) {
      loginButton.disabled = false
      logoutButton.disabled = true
    }
    else {
      loginButton.disabled = true
      loginButton.disabled = false
    }
  }, [user])

  return (
    <>
      <Head>
        <title>Magic Login Demo</title>
        <meta name="description" content="a login page demo using magic link" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className={styles.container}>
          <div className={styles.user}>
            {
              !user ?
                "no user available" :
                `Current user: ${user.email}`
            }
          </div>

          <div className={styles.popup}>
            <button
              type="button"
              onClick={handleLogoutButtonClicked}
              className={styles.button} 
              id={USERACTION_TYPES.LOG_OUT}
              >{USERACTION_TYPES.LOG_OUT}</button>
              
            <button
              type='button' 
              onClick={handleLoginButtonClicked} 
              className={styles.button} 
              id={USERACTION_TYPES.LOG_IN}
              >{USERACTION_TYPES.LOG_IN}</button>         
          </div>
        </div>
      </main>
    </>
  );
}
