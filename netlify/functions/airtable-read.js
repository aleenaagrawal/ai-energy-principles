const ALLOWED_TABLES = [
  'tblV9AL3Q0gipS9Cj', // Endorsements
  'tbl2H7FsOAuN4djtr', // Case Studies
];

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method not allowed' };
  }
  try {
    const table = event.queryStringParameters && event.queryStringParameters.table;
    const query = event.queryStringParameters && event.queryStringParameters.query || '';

    if (!table || !ALLOWED_TABLES.includes(table)) {
      return { statusCode: 403, body: JSON.stringify({ error: 'Table not allowed' }) };
    }

    const url = `https://api.airtable.com/v0/app3lFdXJvCN4vmv2/${table}${query ? '?' + query : ''}`;

    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${process.env.AIRTABLE_TOKEN}` },
    });
    const data = await res.json();
    return {
      statusCode: res.status,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
