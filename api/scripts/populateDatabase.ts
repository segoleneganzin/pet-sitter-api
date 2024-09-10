import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const signupApi = 'http://localhost:3000/api/users/register';

const petSitters = [
  {
    email: 'sophie@test.com',
    password: 'test123',
    firstName: 'Sophie',
    lastName: 'Roux',
    city: 'Lorient',
  },
  {
    email: 'marie@test.com',
    password: 'test123',
    firstName: 'Marie',
    lastName: 'Dupont',
    city: 'Paris',
  },
  {
    email: 'jean@test.com',
    password: 'test123',
    firstName: 'Jean',
    lastName: 'Martin',
    city: 'Lyon',
  },
  {
    email: 'luci@test.com',
    password: 'test123',
    firstName: 'Lucie',
    lastName: 'Bernard',
    city: 'Marseille',
  },
];

petSitters.forEach((petSitter) => {
  axios
    .post(signupApi, petSitter)
    .then((response) => console.log(response.data))
    .catch((error) => console.error(error.response.data));
});
