CREATE TABLE cliente (
    cpf CHAR(11) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL
);

CREATE TABLE tecnico (
    pis CHAR(11) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    especialidade VARCHAR(100) NOT NULL
);

CREATE TABLE equipamento (
    num_serie VARCHAR(30) PRIMARY KEY,
    tipo VARCHAR(50),
    marca VARCHAR(30),
    modelo VARCHAR(50),
    cpf_cliente char(11) NOT NULL,
    CONSTRAINT fk_equipamento_cliente
        FOREIGN KEY (cpf_cliente)
        REFERENCES cliente(cpf)
);

CREATE TABLE ordem_servico (
    cod_os SERIAL PRIMARY KEY,
    data_solicitacao DATE NOT NULL,
    problema TEXT,
    status VARCHAR(30),
    data_inicio DATE,
    data_fim DATE,
    solucao TEXT,
    valor DECIMAL(10,2),
    cpf_cliente CHAR(11) NOT NULL,
    num_serie_equip VARCHAR(30) NOT NULL,
    pis_tecnico CHAR(11) NULL,
    CONSTRAINT fk_ordem_cliente
        FOREIGN KEY (cpf_cliente)
        REFERENCES cliente(cpf),
    CONSTRAINT fk_ordem_equipamento
        FOREIGN KEY (num_serie_equip)
        REFERENCES equipamento(num_serie),
    CONSTRAINT fk_ordem_tecnico
        FOREIGN KEY (pis_tecnico)
        REFERENCES tecnico(pis)
);