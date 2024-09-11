import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

interface User {
  email: string;
  password: string;
  role: 'sitter' | 'owner';
  firstName: string;
  lastName: string;
  city: string;
  country: string;
  tel?: string;
  presentation?: string;
  acceptedPets?: string;
  pets?: string;
}

const signupApi = 'http://localhost:3000/api/v1/users';

const users: User[] = [
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
    acceptedPets: 'dog, cat',
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
    acceptedPets: 'dog, cat',
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
    acceptedPets: 'dog, cat',
  },
  {
    email: 'lucie@test.com',
    password: 'test123',
    role: 'owner',
    firstName: 'Lucie',
    lastName: 'Bernard',
    city: 'Marseille',
    country: 'France',
    pets: 'dog, cat',
  },
];

users.forEach((user: User) => {
  const formData = new FormData();
  Object.keys(user).forEach((key) => {
    const value = user[key as keyof User];
    if (value !== undefined) {
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    }
  });

  axios
    .post(signupApi, formData)
    .then((response) => console.log(response.data))
    .catch((error) => console.error(error.response?.data || error.message));
});
