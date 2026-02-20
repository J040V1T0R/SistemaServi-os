const express = require('express');
const cors = require('cors');
const uuid = require('uuid');
const { Low, JSONFile } = require('lowdb');
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// middleware
app.use(cors());
app.use(express.json());

// simple route
app.get('/', (req, res) => {
  res.json({ message: 'Backend up and running!' });
});

// example API route group
const apiRouter = express.Router();

// simple health/status endpoint
apiRouter.get('/status', (req, res) => {
  res.json({ status: 'ok' });
});

// --- database setup -------------------------------------------------
const usePg = !!(process.env.DATABASE_URL || process.env.PGHOST);

let pool = null;
if (usePg) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
  });
}

const dbFile = process.env.DB_FILE || 'data.json';
const adapter = new JSONFile(path.resolve(dbFile));
const db = new Low(adapter);

// initialize lowdb if PG not used
(async () => {
  if (!usePg) {
    await db.read();
    db.data ||= { orders: [] };
    await db.write();
  }
})();

async function listOrders() {
  if (usePg && pool) {
    const q = `SELECT cod_os, data_solicitacao, problema, status, data_inicio, data_fim, solucao, valor, cpf_cliente, num_serie_equip, pis_tecnico FROM ordem_servico ORDER BY cod_os DESC`;
    const res = await pool.query(q);
    return res.rows.map(r => ({
      id: r.cod_os,
      requestDate: r.data_solicitacao,
      problemDescription: r.problema,
      status: r.status,
      startDate: r.data_inicio,
      endDate: r.data_fim,
      solution: r.solucao,
      value: r.valor,
      clientCpf: r.cpf_cliente,
      serialNumber: r.num_serie_equip,
      technicianId: r.pis_tecnico,
    }));
  }
  return db.data.orders;
}

async function insertOrder(order) {
  if (usePg && pool) {
    const q = `INSERT INTO ordem_servico (data_solicitacao, problema, status, cpf_cliente, num_serie_equip, pis_tecnico, valor) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING cod_os`;
    const values = [new Date(), order.problemDescription, order.status || 'Pendente', order.clientCpf, order.serialNumber, order.technicianId || null, order.value || null];
    const res = await pool.query(q, values);
    return { id: res.rows[0].cod_os, ...order };
  }
  // ensure a unique id exists for lowdb fallback
  if (!order.id) order.id = uuid.v4();
  db.data.orders.push(order);
  await db.write();
  return order;
}
// --------------------------------------------------------------------

// list all orders
apiRouter.get('/orders', async (req, res) => {
  try {
    const all = await listOrders();
    res.json(all);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'failed to list orders' });
  }
});

// create new order
apiRouter.post('/orders', async (req, res) => {
  const { clientCpf, serialNumber, equipType, technicianId, problemDescription, value } = req.body;
  if (!clientCpf || !serialNumber || !equipType || !problemDescription) {
    return res.status(400).json({ error: 'missing required fields' });
  }
  const newOrder = {
    clientCpf,
    serialNumber,
    equipType,
    technicianId,
    problemDescription,
    status: 'Pendente',
    value: value || null,
    createdAt: new Date().toISOString(),
  };
  try {
    const result = await insertOrder(newOrder);
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'failed to create order' });
  }
});

app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});