import React, { Dispatch } from "react"

export type USERCONTEXT = {
  user: USER
  dispatch: Dispatch<ACTION>
}

export enum USERACTION_TYPES {
  LOG_IN = "LOG IN",
  LOG_OUT = "LOG OUT",
}

export type ACTION = {
  type: USERACTION_TYPES
  user: USER
}

export type USER = {
  email: string,
  issuer: string
} | null

export const UserReducer = (user: USER, action: ACTION) => {
  switch (action.type) {
    case USERACTION_TYPES.LOG_IN:
      return action.user

    case USERACTION_TYPES.LOG_OUT:
      return null

    default:
      throw new Error(`unhandled action type: ${action.type}`)
  }
}

export const UserContext = React.createContext<USERCONTEXT>({
  user: null,
  dispatch: () => {}
})
