INSERT INTO cliente (cpf, nome, telefone, email) VALUES
('42345678976', 'Joao Cleber', '31999999999', 'joao@email.com'),
('12235678976', 'Jose Cleber', '31999899999', 'jose@email.com'),
('52335678976', 'Maria Eduarda', '31997899999', 'maria@email.com'),
('92335678977', 'Betania', '31957899999', 'betania@email.com'),
('22345696856', 'Matheus', '31976999999', 'matheus@email.com'),
('32231348976', 'Pablo', '31999899954', 'pablo@email.com'),
('62335678986', 'Lara', '31978957499', 'lara@email.com'),
('72366678977', 'Marcelina', '31957895559', 'marcelina@email.com'),
('82345678976', 'Marcos', '31993339999', 'marcos@email.com'),
('15235678976', 'Fabio', '31999877999', 'fabio@email.com'),
('57335678976', 'Joana', '31997895699', 'joana@email.com'),
('97335678977', 'Claudia', '31953329999', 'claudia@email.com');

INSERT INTO tecnico (pis, nome, telefone, especialidade) VALUES
('98765432536', 'Paulo', '27977778888', 'Notebook'),
('42837489238', 'Serafim', '38988882222', 'Impressora'),
('36372839201', 'Janaina', '31977335674', 'Celular'),
('28765436336', 'Mario', '27977734388', 'Notebook'),
('12293218938', 'Lucas', '38983382222', 'Impressora'),
('76378439201', 'Julia', '31977555674', 'Celular'),
('58765455536', 'Guilherme', '31977235388', 'Notebook');

INSERT INTO equipamento (num_serie, tipo, marca, modelo, cpf_cliente) VALUES
('XYZB24', 'Notebook', 'Acer', 'Aspire', '42345678976'),
('PKNB44PER', 'Impressora', 'Samsung', 'SL-M4070FR', '12235678976'),
('XBEYN2LK', 'Celular', 'Samsung', 'S23', '52335678976'),
('JDHE14', 'Notebook', 'Vaio', 'FE16', '92335678977'),
('XYKE55', 'Notebook', 'Dell', 'Inspiron', '22345696856'),
('PKWB45ERC', 'Impressora', 'HP', 'Laser 107a', '32231348976'),
('SDKEDLPE', 'Celular', 'Motorola', 'G53', '62335678986'),
('IDPO32', 'Notebook', 'Avell', 'Storm', '72366678977'),
('WRDB74', 'Notebook', 'Asus', 'Vivobook', '82345678976'),
('MDKB86DRR', 'Impressora', 'Brother', 'L5652DN', '15235678976'),
('RBEUN5LK', 'Celular', 'Apple', 'iPhone17', '57335678976'),
('MKJH56', 'Notebook', 'Positivo', 'Vision', '97335678977');

INSERT INTO ordem_servico (data_solicitacao, problema, status, cpf_cliente, num_serie_equip, data_inicio, data_fim, solucao, valor, pis_tecnico) VALUES
('2026-01-05', 'O teclado do meu notebook nao funciona', 'Pendente', '42345678976', 'XYZB24', NULL, NULL, NULL, NULL,NULL),
('2025-12-28', 'Impressora nao liga', 'Concluida', '12235678976', 'PKNB44PER','2026-01-05', '2026-01-06', 'Fonte queimada. Troca da fonte da impressora', '500.00', '42837489238'),
('2026-01-03', 'Meu celular esta com a tela trincada, quero uma nova', 'Concluida', '52335678976', 'XBEYN2LK','2026-01-05', '2026-01-06', 'Troca da tela do celular do cliente conforme solicitado', '1300.00', '76378439201'),
('2025-11-29', 'Meu notebook liga mas nao da tela', 'Pendente', '92335678977', 'JDHE14', NULL, NULL, NULL, NULL,NULL),
('2025-11-05', 'Notebook nao liga', 'Pendente', '22345696856', 'XYKE55', NULL, NULL, NULL, NULL,NULL),
('2025-12-07', 'Impressora imprime muito claro', 'Concluida', '32231348976', 'PKWB45ERC','2025-12-10', '2025-12-12', 'Troca da fusora da impressora, a antiga estava com defeito', '1000.00', '12293218938'),
('2026-01-13', 'Celular nao liga', 'Pendente', '62335678986', 'SDKEDLPE', NULL, NULL, NULL, NULL,NULL),
('2025-10-29', 'Notebook com tela trincada, favor trocar', 'Concluida', '72366678977', 'IDPO32', '2025-11-02', '2025-12-03', 'Troca da tela do notebook conforme solicitado', '650.00', '58765455536'),
('2024-08-05', 'Notebook esquenta muito e fica lento', 'Concluida', '82345678976', 'WRDB74',  '2024-08-07', '2024-08-08', 'Limpeza e Troca da pasta térmica', '100.00', '98765432536'),
('2024-09-28', 'Impressora liga mas fica travada no painel inicial', 'Concluida', '15235678976', 'MDKB86DRR', '2024-10-07', '2024-10-10', 'Troca da placa-mãe da impressora', '5000.00', '98765432536'),
('2026-01-10', 'Bateria do meu celular estufou', 'Pendente', '57335678976', 'RBEUN5LK', NULL, NULL, NULL, NULL,NULL),
('2025-11-19', 'Notebook desliga sozinho depois de 10 minutos de uso', 'Pendente', '97335678977', 'MKJH56', NULL, NULL, NULL, NULL,NULL);
