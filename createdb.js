require('dotenv').config();
const fs = require('fs');
const util = require('util');
const { Client } = require('pg');
const XLSX = require('xlsx');

const workbook = XLSX.readFile('./data/books.xlsx');
const { sheet_name_list } = workbook.SheetNames;
const xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

const connectionString = process.env.DATABASE_URL || 'postgres://notandi:@localhost/v3';
const readFileAsync = util.promisify(fs.readFile);
const schemaFile = './schema.sql';


async function insertBooks(IB, title, category) {
  const client = new Client({ connectionString });
  await client.connect();
  const q = 'INSERT INTO books (isbn13, title, category) VALUES ($1, $2, $3)';
  try {
    await client.query(q, ['{$IB}', title, category]);
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

  const isbn13 = 'isbn13';
  const title = 'title';
  const category = 'category';

  for (let i = 0; i < xlData.length; i += 1) {
    await insertBooks(xlData[i][isbn13], xlData[i][title], xlData[i][category]);
  }

  await query('insert into Category (category) select distinct category from books');
}

create().catch((err) => {
  console.error('Error creating schema', err);
});
