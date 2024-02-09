import {
  UserContext,
  UserReducer,
  USERACTION_TYPES,
} from "@/context/user-context";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import React from "react";
import { useRouter } from "next/router";
import { magic } from "@/lib/magic";
import Loading from '@/components/Loading/Loading'

export default function App({ Component, pageProps }: AppProps) {
  const initialUser = null;
  const [user, dispatch] = React.useReducer(UserReducer, initialUser);
  const [isLoading, setIsLoading] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    const handleLoggedIn = async () => {
      if (magic === false) {
        setIsLoading(false);
        return;
      }

      const isLoggedIn = await magic.user.isLoggedIn();
      setIsLoading(false);

      if (isLoggedIn) {
        const userMetadata = await magic.user.getInfo();

        dispatch({
          type: USERACTION_TYPES.LOG_IN,
          user: {
            email: userMetadata.email as string,
            issuer: userMetadata.issuer as string,
          },
        });

        console.log(userMetadata);
      } else {
        console.log("no one signed in");
      }
    };

    handleLoggedIn();
  }, []);

  React.useEffect(() => {
    const handleComplete = () => {
      setIsLoading(false);
    };

    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  const value = React.useMemo(
    () => ({ user: user, dispatch: dispatch }),
    [user, dispatch]
  );

  return (
    <>
      {
        isLoading ?
          <Loading /> :
          <UserContext.Provider value={value}>
            <Component {...pageProps} />
          </UserContext.Provider>
      }
    </>
  );
}
