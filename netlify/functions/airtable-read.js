const ALLOWED_TABLES = [
  'tblV9AL3Q0gipS9Cj', // Endorsements
  'tbl2H7FsOAuN4djtr', // Case Studies
];

// Netlify functions run Node 18+ by default which has native fetch.
// If you see "fetch is not defined", set NODE_VERSION=18 in Netlify env vars.

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const params = event.queryStringParameters || {};
    const table  = params.table;
    const query  = params.query || '';

    if (!table || !ALLOWED_TABLES.includes(table)) {
      return {
        statusCode: 403,
        body: JSON.stringify({ error: 'Table not allowed' }),
      };
    }

    // query arrives double-encoded from the browser — decode once before
    // forwarding so Airtable receives clean params
    const decodedQuery = query ? decodeURIComponent(query) : '';

    const url = decodedQuery
      ? `https://api.airtable.com/v0/app3lFdXJvCN4vmv2/${table}?${decodedQuery}`
      : `https://api.airtable.com/v0/app3lFdXJvCN4vmv2/${table}`;

    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${process.env.AIRTABLE_TOKEN}`,
      },
    });

    const data = await res.json();

    return {
      statusCode: res.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(data),
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
