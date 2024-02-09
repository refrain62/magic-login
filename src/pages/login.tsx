import React from "react"
import { useRouter } from "next/router"

import styles from "@/styles/Login.module.css"
import { magicLogin } from "@/lib/magic"
import { USERACTION_TYPES, UserContext } from "@/context/user-context"

const Login = () => {
  const router = useRouter()
  const {user, dispatch} = React.useContext(UserContext)
  const [email, setEmail] = React.useState("")
  const [userMessage, setMessage] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    // Prefetch the dashboard page
    router.prefetch('/')
  }, [router])

  React.useEffect(() => {
    const handleComplate = () => {
      setIsLoading(false)
    }

    router.events.on("routerChangeComplete", handleComplate)
    router.events.on("routerChangeError", handleComplate)

    return () => {
      router.events.off("routerChangeComplete", handleComplate)
      router.events.off("routeChangeError", handleComplate)
    }
  }, [router])

  React.useEffect(() => {
    if (user === null) {
      setIsLoading(false)
    }
    else {
      user?.issuer && router.push("/")
    }
  }, [user])

  const handleEmailInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    setMessage("")
  }

  const handleLoginButtonClicked = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    console.log(email)

    if (email.trim() === '') {
        setMessage("Please enter a valid email address.")
    } else {
        setMessage("")
        setIsLoading(true)
        
        const userMetadata = await magicLogin(email)
        console.log(userMetadata)
        
        dispatch({
            type: USERACTION_TYPES.LOG_IN, 
            user: {
                email: userMetadata?.email as string, 
                issuer: userMetadata?.issuer as string
              }
        })
        
        setEmail("")
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.popup}>
        <h2 className={styles.title}>Log In</h2>
        <input
          type="text" 
          placeholder="Email address"
          onChange={handleEmailInputChange} 
          className={styles.emailInput} 
          ></input>
        <p className={styles.message}>{userMessage}</p>
        <button
          type="button"
          onClick={handleLoginButtonClicked}
          className={styles.button}>
            {isLoading ? "Loading" : "Log In"}
          </button>
      </div>
    </div>
  )
}

export default Login