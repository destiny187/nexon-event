
userDb = db.getSiblingDB('userdb');

userDb.users.insertMany([
    {
        nickname: 'jinseong',
        password: '1111',
        email: 'jskim@nexon.com',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        nickname: 'test',
        password: '2222',
        email: 'test@nexon.com',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
]);