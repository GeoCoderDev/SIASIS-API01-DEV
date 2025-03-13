

-- Insertar 10 profesores de primaria en la base de datos
INSERT INTO "T_Profesores_Primaria" 
("DNI_Profesor_Primaria", "Nombres", "Apellidos", "Genero", "Nombre_Usuario", "Estado", "Correo_Electronico", "Celular", "Contraseña", "Google_Drive_Foto_ID")
VALUES
('45678901', 'María', 'Sánchez Rodríguez', 'F', 'maria_sanchez_4567', TRUE, 'maria.sanchez@educacion.com', '987654321', '247e8f7b95419d077e4430689e358928:9527745e34ff43adea0fd45f89648c00', NULL),
('45678902', 'Carlos', 'Flores Mendoza', 'M', 'carlos_flores_4567', TRUE, 'carlos.flores@educacion.com', '987654322', '247e8f7b95419d077e4430689e358928:9527745e34ff43adea0fd45f89648c00', NULL),
('45678903', 'Ana', 'Paredes Jiménez', 'F', 'ana_paredes_4567', TRUE, 'ana.paredes@educacion.com', '987654323', '247e8f7b95419d077e4430689e358928:9527745e34ff43adea0fd45f89648c00', NULL),
('45678904', 'Jorge', 'Ramírez Torres', 'M', 'jorge_ramirez_4567', TRUE, 'jorge.ramirez@educacion.com', '987654324', '247e8f7b95419d077e4430689e358928:9527745e34ff43adea0fd45f89648c00', NULL),
('45678905', 'Lucía', 'González López', 'F', 'lucia_gonzalez_4567', TRUE, 'lucia.gonzalez@educacion.com', '987654325', '247e8f7b95419d077e4430689e358928:9527745e34ff43adea0fd45f89648c00', NULL),
('45678906', 'Pedro', 'Castro Ruiz', 'M', 'pedro_castro_4567', TRUE, 'pedro.castro@educacion.com', '987654326', '247e8f7b95419d077e4430689e358928:9527745e34ff43adea0fd45f89648c00', NULL),
('45678907', 'Isabel', 'Díaz Morales', 'F', 'isabel_diaz_4567', TRUE, 'isabel.diaz@educacion.com', '987654327', '247e8f7b95419d077e4430689e358928:9527745e34ff43adea0fd45f89648c00', NULL),
('45678908', 'Roberto', 'Vargas Herrera', 'M', 'roberto_vargas_4567', TRUE, 'roberto.vargas@educacion.com', '987654328', '247e8f7b95419d077e4430689e358928:9527745e34ff43adea0fd45f89648c00', NULL),
('45678909', 'Carmen', 'Ortega Campos', 'F', 'carmen_ortega_4567', TRUE, 'carmen.ortega@educacion.com', '987654329', '247e8f7b95419d077e4430689e358928:9527745e34ff43adea0fd45f89648c00', NULL),
('45678910', 'Miguel', 'Reyes Miranda', 'M', 'miguel_reyes_4567', TRUE, 'miguel.reyes@educacion.com', '987654330', '247e8f7b95419d077e4430689e358928:9527745e34ff43adea0fd45f89648c00', NULL);


-- Insertar 2 auxiliares en la base de datos
INSERT INTO "T_Auxiliares" 
("DNI_Auxiliar", "Nombres", "Apellidos", "Genero", "Nombre_Usuario", "Estado", "Correo_Electronico", "Celular", "Contraseña", "Google_Drive_Foto_ID")
VALUES
('34567801', 'Rosa', 'Mendoza Valdivia', 'F', 'rosa.mendoza', TRUE, 'rosa.mendoza@escuela.edu.pe', '956781234', '94c121b9e7bf08a65154b8af0b2a31fe:acf3495f8f56715a4893bc66d4312ef9', NULL),
('34567802', 'Fernando', 'Gutiérrez Pérez', 'M', 'fernando.gutierrez', TRUE, 'fernando.gutierrez@escuela.edu.pe', '956781235', '94c121b9e7bf08a65154b8af0b2a31fe:acf3495f8f56715a4893bc66d4312ef9', NULL);



-- Insertar 12 profesores de secundaria en la base de datos
INSERT INTO "T_Profesores_Secundaria" 
("DNI_Profesor_Secundaria", "Nombres", "Apellidos", "Genero", "Nombre_Usuario", "Estado", "Correo_Electronico", "Celular", "Contraseña", "Google_Drive_Foto_ID")
VALUES
('56789001', 'Javier', 'Martínez Soto', 'M', 'javier_martinez_5678', TRUE, 'javier.martinez@secundaria.edu.pe', '912345678', 'a87f5b9d3176:c23ea03df05a2e1f21a9dc7e878361ee3f1f1e81ea86b2e8d45d8a5acf8e65', NULL),
('56789002', 'Sofía', 'Vargas Morales', 'F', 'sofia_vargas_5678', TRUE, 'sofia.vargas@secundaria.edu.pe', '912345679', 'b98g6c0e4287:d34fb14eg16b3g2g32b8ed7f989472ff2e2f1f92fb97c3f9e56e0b6cg9f76', NULL),
('56789003', 'Luis', 'Patiño Ramos', 'M', 'luis_patino_5678', TRUE, 'luis.patino@secundaria.edu.pe', '912345680', 'c09h7d1f5398:e45gc25fh27c4h3h43c9fe8g090583gg3g3g2g03gc08d4h0g67g1dch087', NULL),
('56789004', 'Gabriela', 'Ochoa Vera', 'F', 'gabriela_ochoa_5678', TRUE, 'gabriela.ochoa@secundaria.edu.pe', '912345681', 'd10i8e2g6409:f56hd36gi38d5i4i54d0gf9h101694hh4h4h3h14hd19e5i1h78h2edi198', NULL),
('56789005', 'Raúl', 'Torres Medina', 'M', 'raul_torres_5678', TRUE, 'raul.torres@secundaria.edu.pe', '912345682', 'e21j9f3h7510:g67ie47hj49e6j5j65e1hg0i212705ii5i5i4i25ie20f6j2i89i3fej209', NULL),
('56789006', 'Patricia', 'Luna Estrada', 'F', 'patricia_luna_5678', TRUE, 'patricia.luna@secundaria.edu.pe', '912345683', 'f32k0g4i8621:h78jf58ik50f7k6k76f2ih1j323816jj6j6j5j36jf31g7k3j90j4gfk310', NULL),
('56789007', 'Eduardo', 'Campos García', 'M', 'eduardo_campos_5678', TRUE, 'eduardo.campos@secundaria.edu.pe', '912345684', 'g43l1h5j9732:i89kg69jl61g8l7l87g3ji2k434927kk7k7k6k47kg42h8l4k01k5hgl421', NULL),
('56789008', 'Diana', 'Ríos Chávez', 'F', 'diana_rios_5678', TRUE, 'diana.rios@secundaria.edu.pe', '912345685', 'h54m2i6k0843:j90lh70km72h9m8m98h4kj3l545038ll8l8l7l58lh53i9m5l12l6ihm532', NULL),
('56789009', 'Víctor', 'Paredes Quispe', 'M', 'victor_paredes_5678', TRUE, 'victor.paredes@secundaria.edu.pe', '912345686', 'i65n3j7l1954:k01mi81ln83i0n9n09i5lk4m656149mm9m9m8m69mi64j0n6m23m7jin643', NULL),
('56789010', 'Claudia', 'Mendoza Espino', 'F', 'claudia_mendoza_5678', TRUE, 'claudia.mendoza@secundaria.edu.pe', '912345687', 'j76o4k8m2065:l12nj92mo94j1o0o10j6ml5n767250nn0n0n9n70nj75k1o7n34n8kjo754', NULL),
('56789011', 'Ricardo', 'Velásquez Rojas', 'M', 'ricardo_velasquez_5678', TRUE, 'ricardo.velasquez@secundaria.edu.pe', '912345688', 'k87p5l9n3176:m23ok03np05k2p1p21k7nm6o878361oo1o1o0o81ok86l2p8o45o9lkp865', NULL),
('56789012', 'Natalia', 'Zegarra Díaz', 'F', 'natalia_zegarra_5678', TRUE, 'natalia.zegarra@secundaria.edu.pe', '912345689', 'l98q6m0o4287:n34pl14oq16l3q2q32l8on7p989472pp2p2p1p92pl97m3q9p56p0mlq976', NULL);


-- Crear 4 aulas y asignarlas a 4 profesores diferentes
INSERT INTO "T_Aulas" 
("Nivel", "Grado", "Seccion", "Color", "DNI_Profesor_Secundaria")
VALUES
('SECUNDARIA', 1, 'A', '#4287f5', '56789001'), -- Aula 1 asignada a Javier Martínez
('SECUNDARIA', 2, 'B', '#42f56f', '56789003'), -- Aula 2 asignada a Luis Patiño
('SECUNDARIA', 3, 'A', '#f54242', '56789005'), -- Aula 3 asignada a Raúl Torres
('SECUNDARIA', 4, 'B', '#f5d442', '56789007'); -- Aula 4 asignada a Eduardo Campos