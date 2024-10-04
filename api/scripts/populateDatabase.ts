import axios from 'axios';
import dotenv from 'dotenv';
import { I_UserCreate } from '../database/models/userModel.js';

dotenv.config();

const signupApi = 'http://localhost:3000/api/v1/users';

const users: I_UserCreate[] = [
  {
    email: 'alice@example.fr',
    password: 'test123',
    roles: 'sitter',
    firstName: 'Alice',
    lastName: 'Dupont',
    city: 'Paris',
    country: 'France',
    tel: '01-23-45-67-89',
    presentation: 'Amoureuse des animaux !',
    acceptedPets: 'dog, cat',
  },
  {
    email: 'bob@example.fr',
    password: 'test123',
    roles: 'owner',
    firstName: 'Bob',
    lastName: 'Martin',
    city: 'Lyon',
    country: 'France',
    pets: 'dog',
  },
  {
    email: 'charlie@example.fr',
    password: 'test123',
    roles: 'sitter, owner',
    firstName: 'Charlie',
    lastName: 'Bernard',
    city: 'Marseille',
    country: 'France',
    tel: '04-56-78-90-12',
    presentation: "Sitter d'animaux expérimenté.",
    acceptedPets: 'dog, cat, nac',
    pets: 'chat, nac',
  },
  {
    email: 'david@example.fr',
    password: 'test123',
    roles: 'owner',
    firstName: 'David',
    lastName: 'Thomas',
    city: 'Toulouse',
    country: 'France',
    pets: 'dog, cat',
  },
  {
    email: 'eve@example.fr',
    password: 'test123',
    roles: 'sitter',
    firstName: 'Eve',
    lastName: 'Leroy',
    city: 'Nice',
    country: 'France',
    tel: '06-12-34-56-78',
    presentation: 'Passionnée par les animaux.',
    acceptedPets: 'dog',
  },
  {
    email: 'frank@example.fr',
    password: 'test123',
    roles: 'sitter, owner',
    firstName: 'Frank',
    lastName: 'Moreau',
    city: 'Strasbourg',
    country: 'France',
    tel: '03-14-15-16-17',
    presentation: 'Passionné par les animaux !',
    acceptedPets: 'cat, dog',
    pets: 'dog',
  },
  {
    email: 'grace@example.fr',
    password: 'test123',
    roles: 'owner',
    firstName: 'Grace',
    lastName: 'Simon',
    city: 'Montpellier',
    country: 'France',
    pets: 'cat',
  },
  {
    email: 'hank@example.fr',
    password: 'test123',
    roles: 'sitter',
    firstName: 'Hank',
    lastName: 'Roux',
    city: 'Bordeaux',
    country: 'France',
    tel: '05-23-45-67-89',
    presentation: 'Amical et responsable.',
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
