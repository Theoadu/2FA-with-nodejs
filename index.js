import express from "express";
import { v4 as uuidv4 } from "uuid";
import speakeasy from "speakeasy";
import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig.js";

const app = express();
app.use(express.json());

const dbConfig = new Config("myDatabase", true, false, "/");

const db = new JsonDB(dbConfig);

app.get("/api", (req, res) => {
  res.json({ message: "Welcome to 2FA" });
});

app.post("/api/register", (req, res) => {
  const id = uuidv4();

  try {
    const path = `/user/${id}`;
    // Create temporary secret until it is verified
    const temp_secret = speakeasy.generateSecret();

    // Create user in the DB
    db.push(path, { id, temp_secret });
    res.json({ id, secret: temp_secret.base32 });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error generating secret key" });
  }
});

app.post("/api/verify", (req, res) => {
  console.log(req.body);
  const { userId, token } = req.body;
  try {
    const path = `/user/${userId}`;
    const user = db.getData(path);

    console.log({ user });

    const { base32: secret } = user.temp_secret;
    const verified = speakeasy.totp.verify({
      secret,
      encoding: "base32",
      token,
    });
    if (verified) {
      db.push(path, { id: userId, secret: user.temp_secret });
      res.json({ verified: true });
    } else {
      res.json({ verified: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error retrieving Person" });
  }
});

app.post("/api/validate", (req, res) => {
  const { userId, token } = req.body;
  try {
    // Retrieve user from database
    const path = `/user/${userId}`;
    const user = db.getData(path);
    console.log({ user });
    const { base32: secret } = user.secret;
    // Returns true if the token matches
    const tokenValidates = speakeasy.totp.verify({
      secret,
      encoding: "base32",
      token,
      window: 1,
    });
    if (tokenValidates) {
      res.json({ validated: true });
    } else {
      res.json({ validated: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving user" });
  }
});

const PORT = 9000;
app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
