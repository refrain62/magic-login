import { Magic } from "magic-sdk"

const createMagic = () => {
  return typeof window !== "undefined" 
                  && process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY !== "undefined"  
                  && new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY!)
}

export const magic = createMagic();

export const magicLogin = async (email: string) => {
  if (magic === false) {
    return null
  }

  try {
    const didToken = await magic.auth.loginWithMagicLink({
      email
    })

    const options = {
      method: 'POST',
      headers: {
        'Context-Type': 'applicatoin/json',
        Authorization: `Bearer ${didToken}`
      },
    }

    const response = await fetch("api/login", optoins)
    console.log(response)

    if (response.ok) {
      const userMetadata = await magic.user.getInfo()
      console.log(userMetadata)

      return userMetadata
    } 
    else {
      return null
    }
  } catch (error) {
    console.log(error)

    return null;
  }
}

export const magicLogout = async () => {
  const errorMessage = "Error creating magic instance while trying to log out"

  if (magic === false) {
    throw new Error(errorMessage)
  }

  try {
    await magic.user.logout()
  } catch (error) {
    throw new Error(error as string)
  }
}
