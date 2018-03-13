require('dotenv').config();

const fs = require('fs');
const util = require('util');
const { Client } = require('pg');
const XLSX = require('xlsx')

const connectionString = process.env.DATABASE_URL || 'postgres://notandi:@localhost/v3';
const readFileAsync = util.promisify(fs.readFile);
const schemaFile = './schema.sql';

var workbook = XLSX.readFile('./data/books.xlsx');
var sheet_name_list = workbook.SheetNames;
var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

// console.log(groupBy('catagory',xlData));

async function insertBooks(IB, title, category) {
  const client = new Client({ connectionString });
  await client.connect();
  const q = 'INSERT INTO books (isbn13, title, category) VALUES ($1, $2, $3)';
  let result;
  try {
    result = await client.query(q, [IB+'',title, category]);  
  } catch (err) {
    throw err;
  } finally {
    await client.end();
  }
}

async function query(q) {
  const client = new Client({ connectionString });

  await client.connect();

  try {
    const result = await client.query(q);
    const { rows } = result;
    return rows;
  } catch (err) {
    console.error('Error running query');
    throw err;
  } finally {
    await client.end();
  }
}

async function create() {
  const data = await readFileAsync(schemaFile);
  
  await query(data.toString('utf-8'));

  console.info('Schema created');

  for (let i = 0; i < xlData.length; i++) {
    await insertBooks(xlData[i]['isbn13'], xlData[i]['title'], xlData[i]['category']);
  }
  console.log('Búið er að lesa inn bækur');
  await query('insert into Category (category) select distinct category from books');
  console.log('Búið er að lesa inn í category');
  
}

create().catch((err) => {
  console.error('Error creating schema', err);
});
