--  Script INSERT directivos

INSERT INTO "T_Directivos"(
	"Nombres", 
	"Apellidos", 
	"Genero", 
	"DNI", 
	"Nombre_Usuario", 
	"Correo_Electronico", 
	"Celular", 
	"Contraseña", 
	"Google_Drive_Foto_ID"
	)
	VALUES 
		('Elena Serafina', 'Cullanco Espilco', 'F', '15430124', 'director.asuncion8', 'elcullancoes@gmail.com', '989729659', 'df890b667b19fc75fb3d34a5c2a987f7:00fbe20c4594916b27492dc1f93ef314', NULL),
		('Maria Luisa', 'Martinez Quispe', 'F', '15430192', 'subdirector.asuncion8', 'luisa.martinezq@gmail.com', '955309963', '6f06be03c8cf3e68e38a11bfa57a3b0d:dd5124195984ad01683c0bff591ff5f4', NULL);

--  Script INSERT Profesores_de_primaria

INSERT INTO "T_Profesores_Primaria"(
	"DNI_Profesor_Primaria", 
	"Nombres", 
	"Apellidos", 
	"Genero", 
	"Nombre_Usuario", 
	"Estado", 
	"Correo_Electronico", 
	"Celular", 
	"Contraseña", 
	"Google_Drive_Foto_ID")
	
	VALUES 
		('15378317', 'Marisol Ceferina', 'Godoy Villarubia', 'F', 'marisol_godoy_1537', TRUE, 'Profesora_mary@hotmail.com', '946879371', '123ddb08c883cbf7ea2b83d914e57b68:7d35062c7512336f8ff0750f3dc38da5', NULL),
		('41612389', 'Walter Humberto', 'Zurita Mamani', 'M', 'walter_zurita_4161', TRUE , 'Humberto_22_2@hotmail.com', '946515164', 'd5cd3a915bf371060b959fb74c4df6af:6e8eafad79f94ebee7bcb80aa63f6af9', NULL),
		('15431326', 'Carmen Dalina', 'Crisostomo Toribio', 'F', 'carmen_crisostomo_1543', TRUE , 'Carmencrisostomo93@gmail.com', '992370794', '54912bf9c173dc55b45c7d079d9338e6:24a51ecf1498e9c4bc8af776c19e4611', NULL),
		('41632436', 'Antonia Alejandrina', 'Carbonero Salazar', 'F', 'antonia_carbonero_4163', TRUE , 'Carbonero236@gmail.com', '959152385', 'af0613a849e3487632e4374d5abcd90d:360bab4a7457e976e3c3d6f2d288e2c0', NULL),
		('15378930', 'Monica Agustina', 'Zavala Quiñonez', 'F', 'monica_zavala_1537', TRUE, 'monicazavala.1960@gmail.com', '951767809', 'b412964ade07a069f9a92b1fd1b1c4a2:a840f9fd46373b001c30f37e72ef1be9', NULL),
		('15346176', 'Dora Elisa', 'Vargas Parvina', 'F', 'dora_vargas_1534', TRUE, 'Doraelisa52@gmail.com', '970874975', '55e5347cff226dff387d8335769ec736:77846280f14c5e959c99dc6c5e25089d', NULL),
		('15371134', 'Fidel Esmil', 'Luyo Sanchez', 'M', 'fidel_luyo_1537', TRUE, 'fidelluyo72@gmail.com', '989934546', 'a4086a9e3c03fda56bb74a556a98a245:8803b46eb452eb22beae79df206c871f', NULL),
		('15379331', 'Rubila Seberiana', 'Quispe Molleda', 'F', 'rubila_quispe_1537', TRUE, 'rubillaquispe@ gmail.com', '951669129', 'e6d566c8dd4325e0856160fb0f727a34:c493f04bd093244802e44303e534bdcb', NULL),
		('15418438', 'Bety Anita', 'Galvan Castillo', 'F', 'bety_galvan_1541', TRUE, 'betygalvan1611@gmail.com', '942936918', 'c5c0b1b3d22688968e39343265a13c61:61c618198cee43a82d7b1b90f1d2462a', NULL),
		('15381971', 'Gladys Aurelia', 'Abarca Rosales', 'F', 'gladys_abarca_1538', TRUE, 'Gladis_abarca9@hotmail.com', '982298382', '7ca54ba4497f19a5085446653ec8526a:074b2a0cd581aef72b0807fcbc80141e', NULL),
		('15413781', 'Margarita', 'Ocares Yaya', 'F', 'margarita_ocares_1541', TRUE, 'Margarita_ocares_yaya@hotmail.com', '997016317', '09ec9f5f8e0056583443f37c50faa17f:9b0b228eb5368cae4494994fb5121d07', NULL),
		('15378868', 'Lurdes Elena', 'Vicente Rodriguez', 'F', 'lurdes_vicente_1537', TRUE, 'lurdes18@gmail.com', '979365267', '96cc219e75425d5b981dd8624b254ef7:174e35bfbe43a54539bb9a8de7a1d2c5', NULL),
		('15428132', 'Richard David', 'Francia Laura', 'M', 'richard_francia_1542', TRUE, 'richarddavidfrancialaura@gmail.com', '958659445', '5aece1b0184d352b935996b6b04f2af4:3517965c120f1b0f431e10f4c2774d08', NULL),
		('15374058', 'Grimaldo', 'Lozano Lozano', 'M', 'grimaldo_lozano_1537', TRUE, NULL, '000000000', '110d258d5a709b5154b3dc301f5eeb57:8dccc8915d4b7b229953984e7d957372', NULL),
		('40154206', 'Zaida Cristina', 'Trejo Perez', 'F', 'zaida_trejo_4015', TRUE, 'zaidatrejop@gmail.com', '948648320', 'a1fcb5c8a028ed1c6377dac176164a79:f03f3dc5cf00491bde1fff5a890c62c9', NULL);

--  Script INSERT para profesores de secundaria

INSERT INTO "T_Profesores_Secundaria"(
	"DNI_Profesor_Secundaria", 
	"Nombres", 
	"Apellidos", 
	"Genero", 
	"Nombre_Usuario", 
	"Estado", 
	"Correo_Electronico", 
	"Celular", 
	"Contraseña", 
	"Google_Drive_Foto_ID")
	VALUES 
		('45393010', 'Alonso Fidel', 'Aburto Sanchez', 'M', 'alonso_aburto_4539', TRUE , 'Alonso-aburto-1988@hotmail.com', '915948795', '2a7f0e13c86704b5aaded46c40ab04b7:42e3b6fbe386bbe72423f80a4b86595a', NULL),
		('45425446', 'Chuquispuma', 'Farizada Sandoval', 'M', 'chuquispuma_farizada_4542', TRUE , 'farizadafeicer@gmail.com', '929380838', 'a9db7e861c22543f97e8ae421b5fc2c1:6c04f74dd369dc2fbc2e50c18da83367', NULL),
		('15420745', 'Daniel Enrique', 'Sanchez Gonzales', 'M', 'daniel_sanchez_1542', TRUE , 'danilodtaurito@gmail.com', '954679871', '555a2c920654036de93751a9416fb48b:f01039cb2a9f400423280e9ace4ecb05', NULL),
		('41899196', 'Roberto Ricardo', 'Grecco Carbonel', 'M', 'roberto_grecco_4189', TRUE , 'gccocarbonelroberto@gmail.com', '980194358', '070e48af46d461ef28ecdd73938f567f:33e9e3f24b46058c7ccfd8334c63713d', NULL),
		('15369977', 'Cariel Fausto', 'Rodriguez Gutierrez', 'M', 'cariel_rodriguez_1536', TRUE , 'Cariel1536@gmail-com', '961288597', '16b4a567ac46cc6b982ec4d5e64cd6ff:af794bfce27b0bb69f04aeac3ee32e5d', NULL),
		('44526115', 'Cynthia', 'Anicama Cruz', 'F', 'cynthia_anicama_4452', TRUE , 'Cynthia.jhoun@gmail-com', '916873598', 'e34f003ded5ae2761b7c1ac33c5e06e1:8d3ed89604971504ac47530087b468fe', NULL),
		('15452973', 'Carmen Rosa', 'Pariona Villaverde', 'F', 'carmen_pariona_1545', TRUE , 'Carmenr13pv@gmail.com', '991642309', 'b115e31d4a728dfaa01bfaeaac924ad2:85a18329ce603d9ca5c8df0ca0ce9dd8', NULL),
		('21524095', 'Renee Sabina', 'Infancion Morales', 'M', 'renee_infancion_2152', TRUE , 'reneeim@hotmail.com', '969136540', '9871aab23ddd1bd9721abbf8a6c31985:ba489f1c7232329fdccfb3ecf8a9aa69', NULL),
		('08909720', 'Alejandrina', 'Mayta Chuquispuma', 'F', 'alejandrina_mayta_0890', TRUE , 'Alejandramayta1966@gmail.com', '983114500', 'cfda94e84b9f42b69a408dd95ca276b2:bb6c0286b69bd7391a0f95768a02e8ba', NULL),
		('15371028', 'David Julian', 'Apolinario Quispe', 'M', 'david_apolinario_1537', TRUE , 'contenencia@gmail.com', '957047854', '20f734828aa60c22fc41c9ba56e3ba03:cd3b2a395a235692d4c80b243005ee26', NULL),
		('40358441', 'Enrique', 'Caceres Becerra', 'M', 'enrique_caceres_4035', TRUE , 'enriquecaceresbecerra@gmail.com', '992613938', '413fdfa0f34ef99570ae0796e90adb45:9874465427bb5a7260b1b6b45efc19d0', NULL),
		('43166950', 'Carmen Rosa', 'Valenzuela Huamán', 'F', 'carmen_valenzuela_4316', TRUE , 'Kmuval4@gmail.com', '948550572', '866b0e14334f93ffe873a2132bac004e:7ea6232bee44d23b08cb31172e849695', NULL),
		('15428217', 'Patricia', 'Caycho Vargas', 'F', 'patricia_caycho_1542', TRUE , NULL, '914068136', '280c64fdd9326da4bf8ff3349a34be1e:a24c6a09843fca64f80317a62085d1d8', NULL),
		('40418786', 'Maribel', 'Goycochea Huari', 'F', 'maribel_goycochea_4041', TRUE , NULL, '952314985', '9f4bdba9e6948bc3157c086309421e08:16738a350751e7a1d939dd03363aa701', NULL);

-- Script INSERT para auxiliar

INSERT INTO public."T_Auxiliares"(
	"DNI_Auxiliar", 
	"Nombres", 
	"Apellidos", 
	"Genero", 
	"Nombre_Usuario", 
	"Estado", 
	"Correo_Electronico", 
	"Celular", 
	"Contraseña", 
	"Google_Drive_Foto_ID")
	VALUES ('15357278', 'Brigida', 'Gonzales Morales', 'F', 'brigida_gonzales_1535', TRUE, 'Bicagonzales168@gmail.com', '950034094', '829ac9961c6f18ada3e7130cf2bf15d7:9af6d0bcfca478e6c7dd7d2ee05abc70', NULL);

-- Script INSERT para personal administrativo

INSERT INTO "T_Personal_Administrativo"(
	"DNI_Personal_Administrativo", 
	"Nombres", 
	"Apellidos", 
	"Genero", 
	"Nombre_Usuario", 
	"Estado", 
	"Celular", 
	"Contraseña", 
	"Google_Drive_Foto_ID", 
	"Horario_Laboral_Entrada", 
	"Horario_Laboral_Salida", 
	"Cargo")
	VALUES 
		('15449593', 'Dominique María Martha', 'Sotomayor Garro', 'F', 'dominique_sotomayor_1544', TRUE, '957335945', '48d6534885958647c8be2fc940eeac67:26f2ccbaa1b6a4a7bf901c56b3e5ea1d', NULL, '07:45:00', '12:45:00', 'Profesora de Inicial'),
		('40251254', 'Yolanda', 'Bernardo Caramendi', 'F', 'yolanda_bernardo_4025', TRUE, '928179872', '1d287f59a25e0a4b31cfe07f7f35130a:facb548211a9db9c35f8f650e9e05650', NULL, '07:45:00', '12:45:00', 'Profesora de Inicial'),
		('40348795', 'Jorge Teodardo', 'Vivas Vilca', 'M', 'jorge_vivas_4034', TRUE, '920067502', '789b966caaef0bae462ae7e2b786eb18:ea358405611b732b6c02f1930fc6c10f', NULL, '08:00:00', '16:00:00', 'Personal de Limpieza'),
		('41809910', 'Jose', 'Centeno Diaz', 'M', 'jose_centeno_4180', TRUE, '914798864', '98ff799f0bacc107a331e3ec7819b398:a8c1d89ff7a28aecf5fdba84b7577fac', NULL, '08:00:00', '16:00:00', 'Personal de Limpieza'),
		('15403469', 'Carmen', 'Cueto Peves', 'F', 'carmen_cueto_1540', TRUE, '989416608', '52aa34b8d87d790ee94b81ff32b104a4:92475f0bab21cd865881a8305e76258b', NULL, '08:00:00', '16:00:00', 'Personal de Limpieza');

-- Script INSERT para las AULAS 

INSERT INTO "T_Aulas"(
	"Nivel", 
	"Grado", 
	"Seccion", 
	"Color", 
	"DNI_Profesor_Primaria", 
	"DNI_Profesor_Secundaria")
	VALUES 
		('P', 1 , 'A', '#FF5733', '15378317', NULL),
		('P', 1 , 'B', '#33FF57', '41612389', NULL),
		('P', 2 , 'A', '#3357FF', '15431326', NULL),
		('P', 2 , 'B', '#FF33A8', '41632436', NULL),
		('P', 3 , 'A', '#A833FF', '15378930', NULL),
		('P', 3 , 'B', '#33FFF5', '15346176', NULL),
		('P', 4 , 'A', '#FFD700', '15371134', NULL),
		('P', 4 , 'B', '#8B4513 ', '15379331', NULL),
		('P', 5 , 'A', '#228B22', '15418438', NULL),
		('P', 5 , 'B', '#DC143C', '15381971', NULL),
		('P', 6 , 'A', '#4169E1 ', '15413781', NULL),
		('P', 6 , 'B', '#FF8C00', '15378868', NULL),
		('S', 1 , 'A', '#9932CC ', NULL, '45393010'),
		('S', 1 , 'B', '#00CED1', NULL, '45425446'),
		('S', 2 , 'A', '#708090 ', NULL, '15420745'),
		('S', 2 , 'B', '#FA8072', NULL, '41899196'),
		('S', 3 , 'A', '#3CB371', NULL, '15369977'),
		('S', 3 , 'B', '#B22222', NULL, '44526115'),
		('S', 4 , 'A', '#00FA9A', NULL, '15452973'),
		('S', 4 , 'B', '#FF4500', NULL, '21524095'),
		('S', 5 , 'A', '#191970 ', NULL, '08909720');


-- script INSERT para horario 

INSERT INTO public."T_Cursos_Horario"(
	"Nombre_Curso", 
	"Dia_Semana", 
	"Indice_Hora_Academica_Inicio", 
	"Cant_Hora_Academicas", 
	"DNI_Profesor_Secundaria", 
	"Id_Aula_Secundaria")
	
	VALUES 
		('Matemática', 1, 1, 2, '15369977', 20),
		('Ciencia y Tecnología', 1, 3, 2, '15369977', 21),
		('Matemática', 2, 3, 2, '15369977', 20),
		('Matemática', 2, 5, 1, '15369977', 17),
		('Matemática', 3, 1, 3, '15369977', 18),
		('Ciencia y Tecnología', 3, 6, 2, '15369977', 21),
		('Matemática', 4, 1, 2, '15369977', 17),
		('Matemática', 4, 3, 2, '15369977', 18),
		('Matemática', 4, 5, 3, '15369977', 19),
		('Matemática', 5, 1, 2, '15369977', 17),
		('Matemática', 5, 3, 1, '15369977', 20),
		('Tutoría', 5, 4, 2, '15369977', 17),
		('Matemática', 5, 6, 2, '15369977', 19),
		
		('Comunicación', 1, 1, 2, '41899196', 14),
		('Comunicación', 1, 3, 2, '41899196', 16),
		('Comunicación', 1, 5, 2, '41899196', 21),
		('Comunicación', 2, 4, 5, '41899196', 15),
		('Comunicación', 2, 6, 2, '41899196', 16),
		('Comunicación', 3, 4, 2, '41899196', 15),
		('Tutoría', 3, 6, 2, '41899196', 16),
		('Comunicación', 4, 3, 2, '41899196', 21),
		('Comunicación', 4, 5, 2, '41899196', 16),
		('Comunicación', 5, 1, 3, '41899196', 14),
		('Comunicación', 5, 4, 2, '41899196', 15),
		('Comunicación', 5, 6, 2, '41899196', 21),
		
		
		('Ciencia y Tecnología', 1, 1, 2, '15452973', 18),
		('Ciencia y Tecnología', 1, 3, 2, '15452973', 19),
		('Ciencia y Tecnología', 1, 6, 2, '15452973', 15),
		('Ciencia y Tecnología', 2, 4, 2, '15452973', 16),
		('Ciencia y Tecnología', 2, 6, 2, '15452973', 15),
		('Ciencia y Tecnología', 3, 1, 2, '15452973', 17),
		('Tutoría', 3, 3, 2, '15452973', 19),
		('Comunicación', 3, 6, 2, '15452973', 19),
		('Ciencia y Tecnología', 4, 3, 2, '15452973', 16),
		('Ciencia y Tecnología', 4, 6, 2, '15452973', 20),
		('Ciencia y Tecnología', 5, 1, 2, '15452973', 18),
		('Ciencia y Tecnología', 5, 4, 2, '15452973', 20),
		('Ciencia y Tecnología', 5, 6, 2, '15452973', 17),

		
		('Comunicación', 1, 1, 2, '21524095', 19),
		('Comunicación', 1, 4, 2, '21524095', 18),
		('Comunicación', 1, 6, 2, '21524095', 17),
		('Comunicación', 2, 1, 2, '21524095', 19),
		('Comunicación', 2, 3, 2, '21524095', 17),
		('Comunicación', 2, 5, 2, '21524095', 20),
		('Comunicación', 3, 1, 2, '21524095', 20),
		('Comunicación', 3, 4, 2, '21524095', 17),
		('Comunicación', 3, 6, 2, '21524095', 18),
		('Comunicación', 4, 1, 2, '21524095', 19),
		('Comunicación', 4, 4, 2, '21524095', 20),
		('Comunicación', 4, 6, 2, '21524095', 18),
		('Tutoría', 5, 1, 2, '21524095', 20),


		('Tutoría', 1, 4,2, '15420745', 15),
		('Ciencias Sociales', 1, 7,1, '15420745', 20),
		('Ciencias Sociales', 2, 1,2, '15420745', 14),
		('Ciencias Sociales', 2, 3,2, '15420745', 21),
		('Ciencias Sociales', 2, 6,2, '15420745', 17),
		('Ciencias Sociales', 3, 1,2, '15420745', 13),
		('Ciencias Sociales', 3, 3,1, '15420745', 17),
		('Ciencias Sociales', 3, 5,1, '15420745', 16),
		('Ciencias Sociales', 3, 6,2, '15420745', 20),
		('Ciencias Sociales', 4, 1,2, '15420745', 16),
		('Ciencia y Tecnología', 4, 3,1, '15420745', 15),
		('Ciencias Sociales', 4, 5,1, '15420745', 18),
		('Ciencias Sociales', 4, 6,1, '15420745', 14),
		('Ciencias Sociales', 4, 7,1, '15420745', 13),
		('Ciencias Sociales', 5, 1,2, '15420745', 15),
		('Ciencias Sociales', 5, 3,2, '15420745', 18),
		('Ciencias Sociales', 5, 5,1, '15420745', 21),

		('Desarrollo Personal, Ciudadanía y Cívica', 1, 3,1, '08909720', 15),
		('Desarrollo Personal, Ciudadanía y Cívica', 1, 4,2, '08909720', 17),
		('Desarrollo Personal, Ciudadanía y Cívica', 1, 7,1, '08909720', 21),
		('Desarrollo Personal, Ciudadanía y Cívica', 2, 1,2, '08909720', 20),
		('Desarrollo Personal, Ciudadanía y Cívica', 2, 3,1, '08909720', 16),
		('Desarrollo Personal, Ciudadanía y Cívica', 2, 5,1, '08909720', 18),
		('Desarrollo Personal, Ciudadanía y Cívica', 2, 6,2, '08909720', 21),
		('Desarrollo Personal, Ciudadanía y Cívica', 3, 1,2, '08909720', 16),
		('Desarrollo Personal, Ciudadanía y Cívica', 3, 3,1, '08909720', 20),
		('Desarrollo Personal, Ciudadanía y Cívica', 3, 4,2, '08909720', 14),
		('Desarrollo Personal, Ciudadanía y Cívica', 4, 1,2, '08909720', 18),
		('Desarrollo Personal, Ciudadanía y Cívica', 4, 3,2, '08909720', 19),
		('Desarrollo Personal, Ciudadanía y Cívica', 4, 5,1, '08909720', 17),
		('Desarrollo Personal, Ciudadanía y Cívica', 4, 7,1, '08909720', 14),
		('Tutoría', 5, 3,2, '08909720', 21),
		('Desarrollo Personal, Ciudadanía y Cívica', 5, 5,1, '08909720', 19),
		('Desarrollo Personal, Ciudadanía y Cívica', 5, 6,2, '08909720', 15),

		('Ciencia y Tecnología', 1, 3,2, '40358441', 14),
		('Matemática', 1, 5,3, '40358441', 14),
		('Matemática', 2, 1,2, '40358441',16),
		('Matemática', 2, 3,3, '40358441', 14),
		('Ciencia y Tecnología', 2, 6,2, '40358441', 14),
		('Matemática', 3, 3,2, '40358441', 16),
		('Matemática', 3, 6,2, '40358441', 15),
		('Matemática', 4, 1,3, '40358441', 13),
		('Matemática', 4, 4,2, '40358441', 15),
		('Matemática', 4, 7,1, '40358441', 16),
		('Matemática', 5, 3,1, '40358441', 15),
		('Matemática', 5, 5,3, '40358441', 13),

		('Educación Física', 1, 1,3, '45393010', 17),
		('Educación Física', 2, 1,3, '45393010', 15),
		('Educación Física', 2, 5,3, '45393010', 19),
		('Educación Física', 3, 1,3, '45393010', 14),
		('Tutoría', 3, 4,2, '45393010', 13),
		('Educación Física', 4, 1,3, '45393010', 20),
		('Educación Física', 4, 5,3, '45393010', 21),
		('Educación Física', 5, 1,3, '45393010', 16),
		('Educación Física', 5, 5,3, '45393010', 18),

		('Inglés', 1, 1,2, '45425446', 15),
		('Comunicación', 1, 4,2, '45425446', 13),
		('Inglés', 1, 6,2, '45425446', 16),
		('Inglés', 2, 1,2, '45425446', 17),
		('Inglés', 2, 3,2, '45425446', 18),
		('Inglés', 3, 1,2, '45425446', 19),
		('Comunicación', 3, 3,1, '45425446', 13),
		('Inglés', 3, 4,2, '45425446', 20),
		('Inglés', 4, 1,2, '45425446', 21),
		('Tutoría', 4, 3,2, '45425446', 14),
		('Comunicación', 4, 5,2, '45425446', 13),
		('Inglés', 5, 3,2, '45425446', 13),
		('Inglés', 5, 6,2, '45425446', 14),

		('Educación para el Trabajo', 1, 1,2, '43166950', 16),
		('Educación para el Trabajo', 1, 5,2, '43166950', 20),
		('Educación Física', 2, 1,3, '43166950', 13),
		('Educación para el Trabajo', 2, 4,2, '43166950', 13),
		('Educación para el Trabajo', 2, 6,2, '43166950', 18),
		('Educación para el Trabajo', 4, 1,2, '43166950', 14),
		('Educación para el Trabajo', 4, 3,2, '43166950', 17),
		('Educación para el Trabajo', 4, 6,2, '43166950', 15),
		('Educación para el Trabajo', 5, 1,2, '43166950', 21),
		('Educación para el Trabajo', 5, 3,2, '43166950', 19),


		('Religión', 1, 1,2, '15371028', 21),
		('Religión', 1, 3,2, '15371028', 20),
		('Religión', 1, 6,2, '15371028', 13),
		('Religión', 3, 1,2, '15371028', 15),
		('Religión', 3, 4,2, '15371028', 18),
		('Religión', 3, 6,2, '15371028', 17),
		('Religión', 5, 1,2, '15371028', 19),
		('Religión', 5, 4,2, '15371028', 14),
		('Religión', 5, 6,2, '15371028', 16),



		('Arte', 1, 3,1, '44526115', 18),
		('Arte', 1, 5,1, '44526115', 16),
		('Tutoría', 1, 6,2, '44526115', 18),
		('Arte', 2, 1,2, '44526115', 18),
		('Arte', 2, 3,2, '44526115', 19),
		('Arte', 2, 7,1, '44526115', 20),
		('Arte', 3, 3,1, '44526115', 15),
		('Arte', 3, 5,1, '44526115', 19),
		('Arte', 3, 6,2, '44526115', 14),
		('Arte', 4, 1,2, '44526115', 15),
		('Arte', 4, 4,1, '44526115', 13),
		('Arte', 4, 5,1, '44526115', 14),
		('Arte', 4, 6,2, '44526115', 17),
		('Arte', 5, 1,2, '44526115', 13),
		('Arte', 5, 3,1, '44526115', 17),
		('Arte', 5, 4,2, '44526115', 16),
		('Arte', 5, 6,2, '44526115', 20),


		('Matemática', 2, 1,2, '15428217', 21),
		('Arte', 2, 5,1, '15428217', 21),
		('Ciencia y Tecnología', 2, 6,2, '15428217', 13),
		('Arte', 3, 1,2, '15428217', 21),
		('Matemática', 3, 3,2, '15428217', 21),
		('Matemática', 3, 5,1, '15428217', 21),
		('Ciencia y Tecnología', 3, 6,2, '15428217', 13),


		('Desarrollo Personal, Ciudadanía y Cívica', 1, 1,1, '40418786', 13),
		('Desarrollo Personal, Ciudadanía y Cívica', 1, 2,2, '40418786', 13),
		('Ciencias Sociales', 1, 5,1, '40418786', 19),
		('Ciencias Sociales', 1, 6,2, '40418786', 19);


-- Insertar 7 registros para la tabla T_Bloqueo_Roles sin bloqueos activos
INSERT INTO "T_Bloqueo_Roles" 
("Id_Bloqueo_Rol", "Rol", "Bloqueo_Total", "Timestamp_Desbloqueo")
VALUES
(1, 'D', FALSE, 0), -- Directivo (sin bloqueo)
(2, 'A', FALSE, 0), -- Auxiliar (sin bloqueo)
(3, 'PP', FALSE, 0), -- Profesor Primaria (sin bloqueo)
(4, 'PS', FALSE, 0), -- Profesor Secundaria (sin bloqueo)
(5, 'TS', FALSE, 0), -- Tutor Secundaria (sin bloqueo)
(6, 'R', FALSE, 0), -- Responsable (sin bloqueo)
(7, 'PA', FALSE, 0); -- Personal Administrativo (sin bloqueo)

-- Inserción de datos en la tabla T_Horarios_Asistencia
INSERT INTO "T_Horarios_Asistencia" ("Nombre", "Valor", "Descripcion", "Ultima_Modificacion") VALUES
('Hora_Inicio_Asistencia_Primaria', '07:45:00', 'Hora de inicio para tomar asistencia en el nivel primaria', CURRENT_TIMESTAMP),
('Hora_Final_Asistencia_Primaria', '12:45:00', 'Hora límite para tomar asistencia en el nivel primaria', CURRENT_TIMESTAMP),
('Hora_Inicio_Asistencia_Secundaria', '13:00:00', 'Hora de inicio para tomar asistencia en el nivel secundaria', CURRENT_TIMESTAMP),
('Hora_Final_Asistencia_Secundaria', '18:30:00', 'Hora límite para tomar asistencia en el nivel secundaria', CURRENT_TIMESTAMP),
('Inicio_Horario_Laboral_Profesores_Primaria', '07:45:00', 'Hora de inicio de la jornada laboral para profesores de primaria', CURRENT_TIMESTAMP),
('Fin_Horario_Laboral_Profesores_Primaria', '12:45:00', 'Hora de fin de la jornada laboral para profesores de primaria', CURRENT_TIMESTAMP),
('Inicio_Horario_Laboral_Secundaria', '13:00:00', 'Hora de inicio de la jornada laboral para profesores de secundaria', CURRENT_TIMESTAMP),
('Fin_Horario_Laboral_Secundaria', '18:30:00', 'Hora de fin de la jornada laboral para profesores de secundaria', CURRENT_TIMESTAMP),
('Inicio_Horario_Laboral_Auxiliar', '12:30:00', 'Hora de inicio de la jornada laboral para auxiliares', CURRENT_TIMESTAMP),
('Fin_Horario_Laboral_Auxiliar', '18:30:00', 'Hora de fin de la jornada laboral para auxiliares', CURRENT_TIMESTAMP),
('Horario_Laboral_Rango_Total_Inicio', '07:00:00', 'Hora de inicio del rango total de la jornada laboral en la institución', CURRENT_TIMESTAMP),
('Horario_Laboral_Rango_Total_Fin', '19:00:00', 'Hora de fin del rango total de la jornada laboral en la institución', CURRENT_TIMESTAMP);


INSERT INTO "T_Eventos" ("Nombre", "Fecha_Inicio", "Fecha_Conclusion") VALUES 
('Año Nuevo', '2025-01-01', '2025-01-01'),
('Jueves Santo', '2025-04-17', '2025-04-17'),
('Viernes Santo', '2025-04-18', '2025-04-18'),
('Día del Trabajo', '2025-05-01', '2025-05-01'),
('Fiestas Patrias', '2025-07-28', '2025-07-29'),
('Santa Rosa de Lima', '2025-08-30', '2025-08-30');

-- Inserta las fechas importantes para el año escolar
INSERT INTO "T_Fechas_Importantes" ("Nombre", "Valor", "Descripcion", "Ultima_Modificacion")
VALUES 
('Fecha_Inicio_Año_Escolar', '2025-03-10', 'Fecha oficial de inicio del año escolar 2025', CURRENT_TIMESTAMP),
('Fecha_Fin_Año_Escolar', '2025-12-19', 'Fecha oficial de finalización del año escolar 2025', CURRENT_TIMESTAMP),
('Fecha_Inicio_Vacaciones_Medio_Año', '2025-07-21', 'Inicio del periodo vacacional de medio año', CURRENT_TIMESTAMP),
('Fecha_Fin_Vacaciones_Medio_Año', '2025-08-08', 'Finalización del periodo vacacional de medio año y retorno a clases', CURRENT_TIMESTAMP);