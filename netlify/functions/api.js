const server = require('../../dist/index.cjs');

// Netlify function handler
exports.handler = async (event, context) => {
  // Simulate Express server behavior for Netlify Functions
  const { httpMethod, path, headers, body, queryStringParameters } = event;
  
  // Create a mock request object
  const req = {
    method: httpMethod,
    url: path,
    headers: headers,
    body: body,
    query: queryStringParameters || {}
  };

  // Create a mock response object
  let responseData = {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    },
    body: ''
  };

  const res = {
    statusCode: 200,
    setHeader: (name, value) => {
      responseData.headers[name] = value;
    },
    json: (data) => {
      responseData.body = JSON.stringify(data);
      return responseData;
    },
    status: (code) => {
      responseData.statusCode = code;
      return res;
    },
    end: () => {
      return responseData;
    }
  };

  try {
    // Handle the request
    await server(req, res);
    return responseData;
  } catch (error) {
    return {
      statusCode: 500,
      headers: responseData.headers,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};
