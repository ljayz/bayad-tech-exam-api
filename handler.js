const mysql = require('serverless-mysql')();

mysql.config({
  host: process.env.MYSQL_ENDPOINT,
  database: process.env.MYSQL_DATABASE,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD
});

const dbError = (error_message) => {
  return {
    statusCode: 502,
    body: JSON.stringify({
      error: 'db_error',
      error_message,
    }),
  };
}

const validationError = (error_message) => {
  return {
    statusCode: 400,
    body: JSON.stringify({
      error: 'validation_error',
      error_message,
    }),
  };
}

export const user = async (event) => {
  const id = event.pathParameters.id;
  const userDetails = await mysql.query(`SELECT * FROM users WHERE id='${id}'`);

  if (userDetails.length === 0) {
    return validationError('User does not exist');
  }

  try {
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        data: userDetails[0],
      }),
    };
  } catch (error) {
    return dbError('Error occurred when trying to select data to database');
  }
};

export const createUser = async (event) => {
  const postArguments = JSON.parse(event.body);
  const validationResult = await mysql.query(`SELECT * FROM users WHERE first_name='${postArguments.firstName}' and last_name='${postArguments.lastName}'`);

  if (validationResult.length) {
    return validationError('User exist');
  }

  try {
    await mysql.query(`INSERT INTO users (first_name, last_name, description, mobile_number) VALUES ('${postArguments.firstName}', '${postArguments.lastName}', '${postArguments.description}', '${postArguments.mobileNumber}')`);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true
      }),
    };
  } catch (error) {
    return dbError('Error occurred when trying to insert data to database');
  }
};

export const updateUser = async (event) => {
  const id = event.pathParameters.id;
  const postArguments = JSON.parse(event.body);
  const validationResult = await mysql.query(`SELECT * FROM users WHERE id='${id}'`);

  if (validationResult.length === 0) {
    return validationError('User does not exist');
  }

  try {
    await mysql.query(`UPDATE users SET first_name='${postArguments.firstName}', last_name='${postArguments.lastName}', description='${postArguments.description}', mobile_number='${postArguments.mobileNumber}' WHERE id=${id}`);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true
      }),
    };
  } catch (error) {
    return dbError('Error occurred when trying to update data to database');
  }
};

export const deleteUser = async (event) => {
  const id = event.pathParameters.id;
  const validationResult = await mysql.query(`SELECT * FROM users WHERE id='${id}'`);

  if (validationResult.exist === 0) {
    return validationError('User does not exist');
  }

  try {
    await mysql.query(`DELETE FROM users WHERE id='${id}'`);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true
      }),
    };
  } catch (error) {
    return dbError('Error occurred when trying to delete data to database');
  }
};

export const users = async () => {
  try {
    const results = await mysql.query('SELECT first_name, last_name FROM users');

    return {
      statusCode: 200,
      body: JSON.stringify(results),
    };
  } catch (error) {
    return dbError('Error occurred when trying to select data to database');
  }
};