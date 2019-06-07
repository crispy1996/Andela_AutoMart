import bcrypt from 'bcrypt';
import ENV from 'dotenv';
import jwt from 'jsonwebtoken';
import userValidation from '../helpers/signup';
import users from '../models/signup';


ENV.config();

const signup = (req, res) => {
  const { error } = userValidation.validation(req.body);

  if (error) {
    res.status(400).json({
      status: 400,
      error: error.details[0].message,
    });

    return;
  }

  const email = users.find(user => user.email === req.body.email);

  if (email) {
    res.status(400).json({
      status: 400,
      error: ' Your email address has already been used.Please try another email ',
    });

    return;
  }

  const payload = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    address: req.body.address,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

  const password = bcrypt.hashSync(req.body.password, 10);

  const newUser = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password,
    address: req.body.address,
  };

  users.push(newUser);

  const id = parseInt(users.length + 1, 10);

  res.status(201).json({
    status: 201,
    data: {
      token,
      id,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      address: req.body.address

    },
  });
};


export default signup;