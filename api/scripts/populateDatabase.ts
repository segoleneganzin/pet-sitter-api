import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const signupApi = 'http://localhost:3000/api/users/register';

const users = [
  {
    email: 'sophie@test.com',
    password: 'test123',
    role: 'sitter',
    firstName: 'Sophie',
    lastName: 'Roux',
    city: 'Lorient',
    country: 'France',
    tel: '0851689255',
    presentation: 'Lorem Ipsum',
    acceptedPets: ['cat', 'dog'],
  },
  {
    email: 'marie@test.com',
    password: 'test123',
    role: 'sitter',
    firstName: 'Marie',
    lastName: 'Dupont',
    city: 'Paris',
    country: 'France',
    tel: '0851689255',
    presentation: 'Lorem Ipsum',
    acceptedPets: ['cat', 'dog', 'nac'],
  },
  {
    email: 'jean@test.com',
    password: 'test123',
    role: 'sitter',
    firstName: 'Jean',
    lastName: 'Martin',
    city: 'Lyon',
    country: 'France',
    tel: '0851689255',
    presentation: 'Lorem Ipsum',
    acceptedPets: ['dog'],
  },
  {
    email: 'luci@test.com',
    password: 'test123',
    role: 'owner',
    firstName: 'Lucie',
    lastName: 'Bernard',
    city: 'Marseille',
    country: 'France',
    pets: ['dog', 'cat'],
  },
];

users.forEach((user) => {
  axios
    .post(signupApi, user)
    .then((response) => console.log(response.data))
    .catch((error) => console.error(error.response.data));
});
