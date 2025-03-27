const DB = [
  {
    id: '1',
    email: 'admin1234@naver.com',
    password: 'admin1234',
    name: '유진',
    userType: 'admin',
  },
  {
    id: '2',
    email: 'admin12345@naver.com',
    password: 'admin12345',
    name: '동욱',
    userType: 'user',
  },
];

type User = {
  id: string;
  name: string;
  email: string;
  userType: string;
};

export const getUserFromDB = (email: string, password: string): User | null => {
  const user = DB.find(
    (user) => user.email === email && user.password === password,
  );

  if (user) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      userType: user.userType,
    };
  } else {
    return null;
  }
};
