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
const usePg = !!(process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME);
console.log(`database mode: ${usePg ? 'postgres' : 'lowdb'}`);

let pool = null;
if (usePg) {
  pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });
  // attempt connection early to catch errors
  pool.connect()
    .then(client => {
      console.log(`✓ Connected to PostgreSQL: ${process.env.DB_NAME} @ ${process.env.DB_HOST}:${process.env.DB_PORT}`);
      client.release();
    })
    .catch(err => {
      console.error('✗ Error connecting to Postgres:', err.message);
      console.error('  Check your .env file credentials (DB_HOST, DB_USER, DB_PASS, DB_NAME)');
    });
}

const dbFile = process.env.DB_FILE || 'data.json';
const adapter = new JSONFile(path.resolve(dbFile));
const db = new Low(adapter);

// initialize lowdb if PG not used
(async () => {
  if (!usePg) {
    await db.read();
    db.data ||= { orders: [], equipments: [], clients: [] };
    await db.write();
  }
})();

async function listOrders() {
  if (usePg && pool) {
    const q = `SELECT o.cod_os, o.data_solicitacao, o.problema, o.status, o.data_inicio, o.data_fim, o.solucao, o.valor, o.cpf_cliente, o.num_serie_equip, o.pis_tecnico,
                      c.nome AS cliente_nome,
                      e.tipo AS equipamento_tipo, e.marca, e.modelo
               FROM ordem_servico o
               LEFT JOIN equipamento e ON e.num_serie = o.num_serie_equip
               LEFT JOIN cliente c ON c.cpf = o.cpf_cliente
               ORDER BY o.cod_os DESC`;
    try {
      const res = await pool.query(q);
      console.log(`fetched ${res.rows.length} orders from Postgres`);
      return res.rows.map(r => ({
        id: r.cod_os,
        requestDate: r.data_solicitacao,
        problemDescription: r.problema,
        status: r.status,
        startDate: r.data_inicio,
        endDate: r.data_fim,
        solution: r.solucao,
        value: r.valor === null ? '-' : `R$ ${Number(r.valor).toFixed(2)}`,
        clientCpf: r.cpf_cliente,
        serialNumber: r.num_serie_equip,
        technicianId: r.pis_tecnico,
        client: r.cliente_nome || null,
        equip: [r.equipamento_tipo, r.marca, r.modelo].filter(Boolean).join(' ') || r.num_serie_equip,
        date: r.data_solicitacao,
        brand: r.marca,
        model: r.modelo,
      }));
    } catch (err) {
      console.error('Error querying orders:', err.message);
      throw err;
    }
  }
  const fallback = db.data.orders;
  console.log(`using lowdb fallback, ${fallback.length} orders`);
  return fallback;
}

async function listTechnicians() {
  if (usePg && pool) {
    const q = `SELECT pis, nome, telefone, especialidade
               FROM tecnico
               ORDER BY nome ASC`;
    try {
      const res = await pool.query(q);
      return res.rows.map(r => ({
        id: r.pis,
        name: r.nome,
        phone: r.telefone,
        specialty: r.especialidade,
      }));
    } catch (err) {
      console.error('Error querying technicians:', err.message);
      throw err;
    }
  }
  return [];
}

async function upsertEquipment(e) {
  // e: { serialNumber, equipType, brand, model, clientCpf }
  if (usePg && pool) {
    const q = `INSERT INTO equipamento (num_serie, tipo, marca, modelo, cpf_cliente) VALUES ($1,$2,$3,$4,$5)
               ON CONFLICT (num_serie) DO UPDATE SET tipo=EXCLUDED.tipo, marca=EXCLUDED.marca, modelo=EXCLUDED.modelo, cpf_cliente=EXCLUDED.cpf_cliente`;
    const vals = [e.serialNumber, e.equipType, e.brand || null, e.model || null, e.clientCpf];
    await pool.query(q, vals);
  } else {
    // lowdb fallback: update or insert
    await db.read();
    db.data ||= {};
    db.data.equipments ||= [];
    const idx = db.data.equipments.findIndex(x => x.serialNumber === e.serialNumber);
    const record = {
      serialNumber: e.serialNumber,
      equipType: e.equipType,
      brand: e.brand || null,
      model: e.model || null,
      clientCpf: e.clientCpf,
    };
    if (idx >= 0) {
      db.data.equipments[idx] = record;
    } else {
      db.data.equipments.push(record);
    }
    await db.write();
  }
}

async function upsertClient(c) {
  // c: { clientCpf, clientName, clientPhone, clientEmail }
  if (usePg && pool) {
    const q = `INSERT INTO cliente (cpf, nome, telefone, email) VALUES ($1,$2,$3,$4)
               ON CONFLICT (cpf) DO UPDATE SET nome=EXCLUDED.nome, telefone=EXCLUDED.telefone, email=EXCLUDED.email`;
    const vals = [c.clientCpf, c.clientName, c.clientPhone, c.clientEmail];
    await pool.query(q, vals);
  } else {
    await db.read();
    db.data ||= {};
    db.data.clients ||= [];
    const idx = db.data.clients.findIndex(x => x.clientCpf === c.clientCpf);
    const record = {
      clientCpf: c.clientCpf,
      clientName: c.clientName,
      clientPhone: c.clientPhone,
      clientEmail: c.clientEmail,
    };
    if (idx >= 0) {
      db.data.clients[idx] = record;
    } else {
      db.data.clients.push(record);
    }
    await db.write();
  }
}

async function insertOrder(order) {
  if (usePg && pool) {
    // ensure client exists/updated before inserting order
    if (order.clientCpf && order.clientName && order.clientPhone && order.clientEmail) {
      await upsertClient(order);
    }
    // ensure equipment exists/updated before inserting order
    if (order.serialNumber && (order.equipType || order.brand || order.model)) {
      await upsertEquipment(order);
    }
    const q = `INSERT INTO ordem_servico (data_solicitacao, problema, status, cpf_cliente, num_serie_equip, pis_tecnico, valor) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING cod_os`;
    const values = [new Date(), order.problemDescription, order.status || 'Pendente', order.clientCpf, order.serialNumber, order.technicianId || null, order.value || null];
    const res = await pool.query(q, values);
    return { id: res.rows[0].cod_os, ...order };
  }
  // ensure a unique id exists for lowdb fallback
  if (!order.id) order.id = uuid.v4();
  if (order.clientCpf) {
    await upsertClient(order);
  }
  // also keep equipment info if provided
  if (order.serialNumber) {
    await upsertEquipment(order);
  }
  db.data.orders.push(order);
  await db.write();
  return order;
}

async function updateOrder(id, updates) {
  const normalizeDate = (value) => {
    if (!value) return null;
    const v = String(value);
    return v.length >= 10 ? v.slice(0, 10) : v;
  };

  if (usePg && pool) {
    const q = `UPDATE ordem_servico
               SET status = COALESCE($1, status),
                   solucao = COALESCE($2, solucao),
                   valor = COALESCE($3, valor),
                   data_inicio = COALESCE($4, data_inicio),
                   data_fim = COALESCE($5, data_fim),
                   pis_tecnico = COALESCE($6, pis_tecnico)
               WHERE cod_os = $7
               RETURNING cod_os`;
    const values = [
      updates.status || null,
      updates.solution || null,
      updates.value ?? null,
      normalizeDate(updates.startDate),
      normalizeDate(updates.endDate),
      updates.technicianId || null,
      id,
    ];
    const res = await pool.query(q, values);
    return res.rows[0] ? { id: res.rows[0].cod_os } : null;
  }

  await db.read();
  db.data ||= { orders: [], equipments: [], clients: [] };
  const idx = db.data.orders.findIndex(o => String(o.id) === String(id));
  if (idx === -1) return null;
  db.data.orders[idx] = {
    ...db.data.orders[idx],
    status: updates.status ?? db.data.orders[idx].status,
    solution: updates.solution ?? db.data.orders[idx].solution,
    value: updates.value ?? db.data.orders[idx].value,
    startDate: updates.startDate ?? db.data.orders[idx].startDate,
    endDate: updates.endDate ?? db.data.orders[idx].endDate,
    technicianId: updates.technicianId ?? db.data.orders[idx].technicianId,
  };
  await db.write();
  return { id };
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

// list technicians
apiRouter.get('/technicians', async (req, res) => {
  try {
    const all = await listTechnicians();
    res.json(all);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'failed to list technicians' });
  }
});

// create new order
apiRouter.post('/orders', async (req, res) => {
  const { clientCpf, clientName, clientPhone, clientEmail, serialNumber, equipType, brand, model, technicianId, problemDescription, value } = req.body;
  if (!clientCpf || !serialNumber || !problemDescription) {
    return res.status(400).json({ error: 'missing required fields: clientCpf, serialNumber, problemDescription' });
  }
  const newOrder = {
    clientCpf,
    clientName,
    clientPhone,
    clientEmail,
    serialNumber,
    equipType,
    brand,
    model,
    technicianId,
    problemDescription,
    status: 'Pendente',
    value: value || null,
    createdAt: new Date().toISOString(),
  };
  try {
    if (usePg && pool) {
      const clientRes = await pool.query('SELECT 1 FROM cliente WHERE cpf = $1', [clientCpf]);
      const clientExists = clientRes.rowCount > 0;
      const hasClientData = !!(clientName && clientPhone && clientEmail);
      if (!clientExists && !hasClientData) {
        return res.status(400).json({ error: 'client not found; provide clientName, clientPhone, clientEmail to create' });
      }
      if (hasClientData) {
        await upsertClient(newOrder);
      }

      const equipRes = await pool.query('SELECT 1 FROM equipamento WHERE num_serie = $1', [serialNumber]);
      const equipExists = equipRes.rowCount > 0;
      if (!equipExists) {
        await upsertEquipment(newOrder);
      } else if (equipType || brand || model) {
        await upsertEquipment(newOrder);
      }
    }
    const result = await insertOrder(newOrder);
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'failed to create order' });
  }
});

// update order status/fields
apiRouter.patch('/orders/:id', async (req, res) => {
  const { id } = req.params;
  const { status, solution, value, startDate, endDate, technicianId } = req.body;
  try {
    const result = await updateOrder(id, { status, solution, value, startDate, endDate, technicianId });
    if (!result) return res.status(404).json({ error: 'order not found' });
    res.json({ id, status, solution, value, startDate, endDate, technicianId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'failed to update order' });
  }
});

app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});