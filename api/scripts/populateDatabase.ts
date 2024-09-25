import axios from 'axios';
import dotenv from 'dotenv';
import { I_UserCreate } from '../database/models/userModel';

dotenv.config();

const signupApi = 'http://localhost:3000/api/v1/users';

const users: I_UserCreate[] = [
  {
    email: 'alice@example.com',
    password: 'hashed_password_1',
    roles: 'sitter',
    firstName: 'Alice',
    lastName: 'Smith',
    city: 'New York',
    country: 'USA',
    tel: '123-456-7890',
    presentation: 'Lover of all pets!',
    acceptedPets: 'cat,dog',
  },
  {
    email: 'bob@example.com',
    password: 'hashed_password_2',
    roles: 'owner',
    firstName: 'Bob',
    lastName: 'Johnson',
    city: 'Los Angeles',
    country: 'USA',
    pets: 'dog',
  },
  {
    email: 'charlie@example.com',
    password: 'hashed_password_3',
    roles: 'sitter, owner',
    firstName: 'Charlie',
    lastName: 'Brown',
    city: 'Chicago',
    country: 'USA',
    tel: '234-567-8901',
    presentation: 'Experienced pet sitter.',
    acceptedPets: 'cat,dog,nac',
    pets: 'cat, nac',
  },
  {
    email: 'david@example.com',
    password: 'hashed_password_4',
    roles: 'owner',
    firstName: 'David',
    lastName: 'Williams',
    city: 'San Francisco',
    country: 'USA',
    pets: 'dog, cat',
  },
  {
    email: 'eve@example.com',
    password: 'hashed_password_5',
    roles: 'sitter',
    firstName: 'Eve',
    lastName: 'Davis',
    city: 'Seattle',
    country: 'USA',
    tel: '345-678-9012',
    presentation: 'Pet lover and caregiver.',
    acceptedPets: 'dog',
  },
  {
    email: 'frank@example.com',
    password: 'hashed_password_6',
    roles: 'sitter, owner',
    firstName: 'Frank',
    lastName: 'Miller',
    city: 'Houston',
    country: 'USA',
    tel: '456-789-0123',
    presentation: 'Passionate about animals!',
    acceptedPets: 'cat, dog',
    pets: 'dog',
  },
  {
    email: 'grace@example.com',
    password: 'hashed_password_7',
    roles: 'owner',
    firstName: 'Grace',
    lastName: 'Garcia',
    city: 'Phoenix',
    country: 'USA',
    pets: 'cat',
  },
  {
    email: 'hank@example.com',
    password: 'hashed_password_8',
    roles: 'sitter',
    firstName: 'Hank',
    lastName: 'Lopez',
    city: 'Philadelphia',
    country: 'USA',
    tel: '567-890-1234',
    presentation: 'Friendly and responsible.',
    acceptedPets: 'nac',
  },
];

users.forEach((user: I_UserCreate) => {
  const formData = new FormData();
  Object.keys(user).forEach((key) => {
    const value = user[key as keyof I_UserCreate];
    if (value !== undefined) {
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else if (typeof value === 'object') {
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
