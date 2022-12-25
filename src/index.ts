import express, { Request, Response } from "express";
import Spotified from "spotified";
import * as querystring from "query-string";
import * as dotenv from 'dotenv'
dotenv.config()

const client_id = process.env.client_id || '';
const client_secret = process.env.client_secret || '';

const client = new Spotified({
  clientId: client_id,
  clientSecret: client_secret,
});
const redirect_uri = "http://127.0.0.1:9999/callback";

const tokens = client.generateAuthLink(redirect_uri, {
  state: "2sm_HV9_bQiMFsrMXZ96dR9XW_hv4GlH",
  scope: [
    "ugc-image-upload",
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-read-currently-playing",
    "app-remote-control",
    "streaming",
    "playlist-read-private",
    "playlist-read-collaborative",
    "playlist-modify-private",
    "playlist-modify-public",
    "user-follow-modify",
    "user-follow-read",
    "user-read-playback-position",
    "user-top-read",
    "user-read-recently-played",
    "user-library-modify",
    "user-library-read",
    "user-read-email",
    "user-read-private",
  ],
});

//const { codeVerifier } = tokens;

console.log(tokens);
const app = express();

app.get("/callback", async (req: Request, res: Response) => {
  var code = req.query.code;
  var state = req.query.state || null;

  if (state === null) {
    res.redirect(
      "/#" +
        querystring.stringify({
          error: "state_mismatch",
        })
    );
  } else {
    const { access_token } = await client.getAccessToken({
      code: code as string,
      redirectUri: redirect_uri,
    });

    client.setBearerToken(access_token);

    const result = await client.users.getCurrentUserProfile();

    console.log(result)
    res.send((result));
  }
});

app.listen(9999, () => {
  console.log("server is running on port 9999");
});
