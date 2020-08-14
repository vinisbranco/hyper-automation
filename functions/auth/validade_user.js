import * as functions from 'firebase-functions';
import jwt from 'jsonwebtoken';
import cors from 'cors';

export default functions
  .runWith({ memory: '2GB' })
  .https
  .onRequest(
    (req, res) => {
      cors(req, res, async () => {
        if (req.method !== 'POST') {
          return res.status(405).send(`Method ${ req.method } not allowed`);
        }

        const { username, token } = req.query;
        const decodedToken = await jwt.verify(token, process.env.AUTH_SECRET_KEY);

        if (decodedToken.username !== username) {
          return res.status(401).send('User not allowed');
        }

        return res.status(200).json(decodedToken);
      });
    }
  );