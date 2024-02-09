import type { NextApiRequest, NextApiResponse } from "next"

type Data = any

import { Magic } from "magic-sdk/admin"
let mAdmin = new Magic(process.env.MAGIC_SECRET_KEY)

export default async function login(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.headers.authentication === undefined) {
    res.status(500).json({ error: "invalid authorization" })
  }

  try {
    const didToken = mAdmin.utils.parseAuthorizationHeader(
      req.headers.authentication!,
    )

    await mAdmin.token.validate(didToken)

    res.status(200).json({ authenticated: true })
  } catch (error) {
    res.status(500).json({ error: error as string })
  }
}
