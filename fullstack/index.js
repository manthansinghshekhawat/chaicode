import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();
const app = express();
app.use(cors({
  origin: '*',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
}));

const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => {
  res.send('Hello World');
});
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
}
);

