import * as functions from 'firebase-functions';
import jwt from 'jsonwebtoken';
import cors from 'cors';

// Remove //
import database from './database.json';
// Remove end //

async function isSAPUserValid({ username, password }) {
  let validUser = false;

  // TODO: Remove loop and get user from SAP
  for (let index = 0; index < database.length; i++) {
    const user = database[i];
    const validation =
      user.username === username &&
      user.password === password;

    if (validation) {
      validUser = true;
      break;
    }
  }
  // TODO end //

  return validUser;
}

async function saveUserOnFirebase() {
  return true;
}

export default functions
  .runWith({ memory: '2GB' })
  .https
  .onRequest(
    (req, res) => {
      cors(req, res, async () => {
        if (req.method !== 'POST') {
          return res.status(405).send(`Method ${ req.method } not allowed`);
        }

        const user = {
          username: req.body.username,
          password: req.body.password
        };
        
        const userIsValid = await isSAPUserValid(user);

        if (!userIsValid) {
          return res.status(401).send('Wrong username or password');
        }

        const saveToFirebase = await saveUserOnFirebase(user);

        if (!saveToFirebase) {
          return res.status(403).send('Can\'t save data to Firebase');
        }
        
        const token = jwt.sign({
          data: { user: user.username }
        }, process.env.AUTH_SECRET_KEY);

        return res.status(200).json({ token });
      });
    }
  );