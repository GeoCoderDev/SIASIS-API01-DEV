-- Función que manejará los triggers
CREATE OR REPLACE FUNCTION registrar_ultima_modificacion_tabla()
RETURNS TRIGGER AS $BODY$
DECLARE
  operacion_texto VARCHAR(20);
  tabla_nombre VARCHAR(100);
  cantidad_afectada INTEGER;
  usuario_actual VARCHAR(100);
BEGIN
  -- Determinar el tipo de operación
  IF TG_OP = 'INSERT' THEN
    operacion_texto := 'INSERT';
  ELSIF TG_OP = 'UPDATE' THEN
    operacion_texto := 'UPDATE';
  ELSIF TG_OP = 'DELETE' THEN
    operacion_texto := 'DELETE';
  ELSIF TG_OP = 'TRUNCATE' THEN
    operacion_texto := 'TRUNCATE';
  END IF;

  -- Obtener el nombre de la tabla
  tabla_nombre := TG_TABLE_NAME;
  
  -- Intentar obtener el usuario actual (puede ser null si no está disponible)
  BEGIN
    usuario_actual := current_setting('app.usuario_actual', true);
  EXCEPTION WHEN OTHERS THEN
    usuario_actual := NULL;
  END;
  
  -- Para operaciones masivas, no podemos contar registros exactamente
  cantidad_afectada := NULL;
  
  -- Insertar o actualizar registro de última modificación
  INSERT INTO "T_Ultima_Modificacion_Tablas" 
    ("Nombre_Tabla", "Operacion", "Usuario_Modificacion", "Cantidad_Filas", "Fecha_Modificacion")
  VALUES 
    (tabla_nombre, operacion_texto, usuario_actual, cantidad_afectada, NOW())
  ON CONFLICT ("Nombre_Tabla") 
  DO UPDATE SET 
    "Operacion" = EXCLUDED."Operacion",
    "Fecha_Modificacion" = NOW(),
    "Usuario_Modificacion" = EXCLUDED."Usuario_Modificacion",
    "Cantidad_Filas" = EXCLUDED."Cantidad_Filas";
  
  -- Para triggers de nivel de fila, devolvemos el valor apropiado
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$BODY$ LANGUAGE plpgsql;

-- Función para establecer el contexto de usuario
CREATE OR REPLACE FUNCTION set_app_usuario(p_usuario VARCHAR)
RETURNS VOID AS $BODY$
BEGIN
  PERFORM set_config('app.usuario_actual', p_usuario, false);
END;
$BODY$ LANGUAGE plpgsql;

-- Crear triggers para cada tabla del esquema

-- Directivos
CREATE TRIGGER trigger_modificacion_directivos
AFTER INSERT OR UPDATE OR DELETE ON "T_Directivos"
FOR EACH STATEMENT EXECUTE FUNCTION registrar_ultima_modificacion_tabla();

-- Estudiantes
CREATE TRIGGER trigger_modificacion_estudiantes
AFTER INSERT OR UPDATE OR DELETE ON "T_Estudiantes"
FOR EACH STATEMENT EXECUTE FUNCTION registrar_ultima_modificacion_tabla();

-- Responsables
CREATE TRIGGER trigger_modificacion_responsables
AFTER INSERT OR UPDATE OR DELETE ON "T_Responsables"
FOR EACH STATEMENT EXECUTE FUNCTION registrar_ultima_modificacion_tabla();

-- Relaciones E-R
CREATE TRIGGER trigger_modificacion_relaciones_e_r
AFTER INSERT OR UPDATE OR DELETE ON "T_Relaciones_E_R"
FOR EACH STATEMENT EXECUTE FUNCTION registrar_ultima_modificacion_tabla();

-- Profesores Primaria
CREATE TRIGGER trigger_modificacion_profesores_primaria
AFTER INSERT OR UPDATE OR DELETE ON "T_Profesores_Primaria"
FOR EACH STATEMENT EXECUTE FUNCTION registrar_ultima_modificacion_tabla();

-- Profesores Secundaria
CREATE TRIGGER trigger_modificacion_profesores_secundaria
AFTER INSERT OR UPDATE OR DELETE ON "T_Profesores_Secundaria"
FOR EACH STATEMENT EXECUTE FUNCTION registrar_ultima_modificacion_tabla();

-- Aulas
CREATE TRIGGER trigger_modificacion_aulas
AFTER INSERT OR UPDATE OR DELETE ON "T_Aulas"
FOR EACH STATEMENT EXECUTE FUNCTION registrar_ultima_modificacion_tabla();

-- Cursos Horario
CREATE TRIGGER trigger_modificacion_cursos_horario
AFTER INSERT OR UPDATE OR DELETE ON "T_Cursos_Horario"
FOR EACH STATEMENT EXECUTE FUNCTION registrar_ultima_modificacion_tabla();

-- Auxiliares
CREATE TRIGGER trigger_modificacion_auxiliares
AFTER INSERT OR UPDATE OR DELETE ON "T_Auxiliares"
FOR EACH STATEMENT EXECUTE FUNCTION registrar_ultima_modificacion_tabla();

-- Personal Administrativo
CREATE TRIGGER trigger_modificacion_personal_administrativo
AFTER INSERT OR UPDATE OR DELETE ON "T_Personal_Administrativo"
FOR EACH STATEMENT EXECUTE FUNCTION registrar_ultima_modificacion_tabla();

-- Eventos
CREATE TRIGGER trigger_modificacion_eventos
AFTER INSERT OR UPDATE OR DELETE ON "T_Eventos"
FOR EACH STATEMENT EXECUTE FUNCTION registrar_ultima_modificacion_tabla();

-- Comunicados
CREATE TRIGGER trigger_modificacion_comunicados
AFTER INSERT OR UPDATE OR DELETE ON "T_Comunicados"
FOR EACH STATEMENT EXECUTE FUNCTION registrar_ultima_modificacion_tabla();

-- Asistencias (tablas primaria)
CREATE TRIGGER trigger_modificacion_a_e_p_1
AFTER INSERT OR UPDATE OR DELETE ON "T_A_E_P_1"
FOR EACH STATEMENT EXECUTE FUNCTION registrar_ultima_modificacion_tabla();

CREATE TRIGGER trigger_modificacion_a_e_p_2
AFTER INSERT OR UPDATE OR DELETE ON "T_A_E_P_2"
FOR EACH STATEMENT EXECUTE FUNCTION registrar_ultima_modificacion_tabla();

CREATE TRIGGER trigger_modificacion_a_e_p_3
AFTER INSERT OR UPDATE OR DELETE ON "T_A_E_P_3"
FOR EACH STATEMENT EXECUTE FUNCTION registrar_ultima_modificacion_tabla();

CREATE TRIGGER trigger_modificacion_a_e_p_4
AFTER INSERT OR UPDATE OR DELETE ON "T_A_E_P_4"
FOR EACH STATEMENT EXECUTE FUNCTION registrar_ultima_modificacion_tabla();

CREATE TRIGGER trigger_modificacion_a_e_p_5
AFTER INSERT OR UPDATE OR DELETE ON "T_A_E_P_5"
FOR EACH STATEMENT EXECUTE FUNCTION registrar_ultima_modificacion_tabla();

CREATE TRIGGER trigger_modificacion_a_e_p_6
AFTER INSERT OR UPDATE OR DELETE ON "T_A_E_P_6"
FOR EACH STATEMENT EXECUTE FUNCTION registrar_ultima_modificacion_tabla();

-- Asistencias (tablas secundaria)
CREATE TRIGGER trigger_modificacion_a_e_s_1
AFTER INSERT OR UPDATE OR DELETE ON "T_A_E_S_1"
FOR EACH STATEMENT EXECUTE FUNCTION registrar_ultima_modificacion_tabla();

CREATE TRIGGER trigger_modificacion_a_e_s_2
AFTER INSERT OR UPDATE OR DELETE ON "T_A_E_S_2"
FOR EACH STATEMENT EXECUTE FUNCTION registrar_ultima_modificacion_tabla();

CREATE TRIGGER trigger_modificacion_a_e_s_3
AFTER INSERT OR UPDATE OR DELETE ON "T_A_E_S_3"
FOR EACH STATEMENT EXECUTE FUNCTION registrar_ultima_modificacion_tabla();

CREATE TRIGGER trigger_modificacion_a_e_s_4
AFTER INSERT OR UPDATE OR DELETE ON "T_A_E_S_4"
FOR EACH STATEMENT EXECUTE FUNCTION registrar_ultima_modificacion_tabla();

CREATE TRIGGER trigger_modificacion_a_e_s_5
AFTER INSERT OR UPDATE OR DELETE ON "T_A_E_S_5"
FOR EACH STATEMENT EXECUTE FUNCTION registrar_ultima_modificacion_tabla();

-- Otras tablas adicionales
CREATE TRIGGER trigger_modificacion_bloqueo_roles
AFTER INSERT OR UPDATE OR DELETE ON "T_Bloqueo_Roles"
FOR EACH STATEMENT EXECUTE FUNCTION registrar_ultima_modificacion_tabla();

CREATE TRIGGER trigger_modificacion_ajustes_generales_sistema
AFTER INSERT OR UPDATE OR DELETE ON "T_Ajustes_Generales_Sistema"
FOR EACH STATEMENT EXECUTE FUNCTION registrar_ultima_modificacion_tabla();

CREATE TRIGGER trigger_modificacion_horarios_asistencia
AFTER INSERT OR UPDATE OR DELETE ON "T_Horarios_Asistencia"
FOR EACH STATEMENT EXECUTE FUNCTION registrar_ultima_modificacion_tabla();

-- Control entradas y salidas (profesores primaria)
CREATE TRIGGER trigger_modificacion_control_entrada_primaria
AFTER INSERT OR UPDATE OR DELETE ON "T_Control_Entrada_Mensual_Profesores_Primaria"
FOR EACH STATEMENT EXECUTE FUNCTION registrar_ultima_modificacion_tabla();

CREATE TRIGGER trigger_modificacion_control_salida_primaria
AFTER INSERT OR UPDATE OR DELETE ON "T_Control_Salida_Mensual_Profesores_Primaria"
FOR EACH STATEMENT EXECUTE FUNCTION registrar_ultima_modificacion_tabla();

-- Control entradas y salidas (profesores secundaria)
CREATE TRIGGER trigger_modificacion_control_entrada_secundaria
AFTER INSERT OR UPDATE OR DELETE ON "T_Control_Entrada_Mensual_Profesores_Secundaria"
FOR EACH STATEMENT EXECUTE FUNCTION registrar_ultima_modificacion_tabla();

CREATE TRIGGER trigger_modificacion_control_salida_secundaria
AFTER INSERT OR UPDATE OR DELETE ON "T_Control_Salida_Mensual_Profesores_Secundaria"
FOR EACH STATEMENT EXECUTE FUNCTION registrar_ultima_modificacion_tabla();

-- Control entradas y salidas (auxiliares)
CREATE TRIGGER trigger_modificacion_control_entrada_auxiliar
AFTER INSERT OR UPDATE OR DELETE ON "T_Control_Entrada_Mensual_Auxiliar"
FOR EACH STATEMENT EXECUTE FUNCTION registrar_ultima_modificacion_tabla();

CREATE TRIGGER trigger_modificacion_control_salida_auxiliar
AFTER INSERT OR UPDATE OR DELETE ON "T_Control_Salida_Mensual_Auxiliar"
FOR EACH STATEMENT EXECUTE FUNCTION registrar_ultima_modificacion_tabla();

-- Control entradas y salidas (personal administrativo)
CREATE TRIGGER trigger_modificacion_control_entrada_administrativo
AFTER INSERT OR UPDATE OR DELETE ON "T_Control_Entrada_Mensual_Personal_Administrativo"
FOR EACH STATEMENT EXECUTE FUNCTION registrar_ultima_modificacion_tabla();

CREATE TRIGGER trigger_modificacion_control_salida_administrativo
AFTER INSERT OR UPDATE OR DELETE ON "T_Control_Salida_Mensual_Personal_Administrativo"
FOR EACH STATEMENT EXECUTE FUNCTION registrar_ultima_modificacion_tabla();

-- Códigos OTP
CREATE TRIGGER trigger_modificacion_codigos_otp
AFTER INSERT OR UPDATE OR DELETE ON "T_Codigos_OTP"
FOR EACH STATEMENT EXECUTE FUNCTION registrar_ultima_modificacion_tabla();

-- Registro fallos sistema
CREATE TRIGGER trigger_modificacion_registro_fallos
AFTER INSERT OR UPDATE OR DELETE ON "T_Registro_Fallos_Sistema"
FOR EACH STATEMENT EXECUTE FUNCTION registrar_ultima_modificacion_tabla();

-- Función para consultar fácilmente la última modificación
CREATE OR REPLACE FUNCTION get_ultima_modificacion_tabla(p_nombre_tabla VARCHAR)
RETURNS TABLE(
  nombre_tabla VARCHAR,
  operacion VARCHAR,
  fecha_modificacion TIMESTAMP,
  usuario_modificacion VARCHAR
) AS $BODY$
BEGIN
  RETURN QUERY
  SELECT 
    umt."Nombre_Tabla",
    umt."Operacion",
    umt."Fecha_Modificacion",
    umt."Usuario_Modificacion"
  FROM "T_Ultima_Modificacion_Tablas" umt
  WHERE umt."Nombre_Tabla" = p_nombre_tabla;
END;
$BODY$ LANGUAGE plpgsql;