CREATE EXTENSION IF NOT EXISTS pg_trgm;  -- Primera línea del archivo
----------------------------------------------------------------------
-- Función y Trigger para actualizar automáticamente el campo updated_at
----------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS roles(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP 
);

----------------------------------------------------------------------
-- Tabla: categories
----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE, -- Nombre único de la categoría
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP -- Registro de actualizaciones
);

----------------------------------------------------------------------
-- Tabla: users
-- Nota: Se podrían agregar campos adicionales (por ejemplo, username, avatar, etc.) según las necesidades.
----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    role_id INT NOT NULL REFERENCES roles(id),
    recovery_token VARCHAR,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP -- Registro de actualizaciones
);
CREATE INDEX ON users (role_id); -- Para joins frecuentes con roles
CREATE INDEX ON users (recovery_token) WHERE recovery_token IS NOT NULL; -- Búsquedas de tokens
CREATE UNIQUE INDEX users_email_unique ON users (email) WHERE email IS NOT NULL; -- Índice único para email, pero solo cuando no es NULL

----------------------------------------------------------------------
-- Tabla: videos
----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS videos (
    id SERIAL PRIMARY KEY,
    file_hash VARCHAR(64) UNIQUE NOT NULL, -- Hash único del archivo de video
    available_resolutions JSONB,           -- Resoluciones disponibles (puede considerarse una tabla separada si se requieren búsquedas complejas)
    available_subtitles JSONB,             -- Subtítulos disponibles
    duration INTERVAL CHECK (duration >= INTERVAL '0 seconds'), -- Duración del video (opcional)
    views BIGINT DEFAULT 0,                -- Número de visualizaciones
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP  -- Fecha de actualización
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_videos_resolutions ON videos USING GIN (available_resolutions);
CREATE INDEX IF NOT EXISTS idx_videos_subtitles ON videos USING GIN (available_subtitles);



----------------------------------------------------------------------
-- Tabla: series
----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS series (
    id SERIAL PRIMARY KEY,
    cover_image VARCHAR(64) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,         -- Título de la serie
    title_normalized VARCHAR(255) GENERATED ALWAYS AS (LOWER(title)) STORED,
    description TEXT,                      -- Descripción opcional
    category_id INT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT, -- Relación con la categoría
    release_year INT NOT NULL CHECK (release_year BETWEEN 1900 AND EXTRACT(YEAR FROM CURRENT_DATE)),-- Año de lanzamiento
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- Fecha de actualización
    CONSTRAINT unique_series_title_year UNIQUE (title_normalized, release_year) -- Garantiza unicidad por título y año
);

CREATE INDEX IF NOT EXISTS idx_series_title ON series(title_normalized);
CREATE INDEX IF NOT EXISTS idx_series_category ON series(category_id);
CREATE INDEX IF NOT EXISTS idx_series_title_trgm ON series USING GIN (title gin_trgm_ops);


----------------------------------------------------------------------
-- Tabla: episodes
----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS episodes (
    id SERIAL PRIMARY KEY,
    serie_id INT NOT NULL REFERENCES series(id) ON DELETE CASCADE,  -- Relación con la serie
    season INT NOT NULL,                   -- Temporada del episodio
    episode_number INT NOT NULL,           -- Número del episodio
    title VARCHAR(255),         -- Título de la serie
    title_normalized VARCHAR(255) GENERATED ALWAYS AS (LOWER(COALESCE(title, 'sin titulo'))) STORED,
    description TEXT,                      -- Descripción opcional
    video_id INT NOT NULL REFERENCES videos(id) ON DELETE CASCADE,    -- Relación con el video correspondiente
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Fecha de actualización
    CONSTRAINT unique_episode UNIQUE (serie_id, season, episode_number), -- Impide duplicados en la misma temporada
    CONSTRAINT unique_episode_video UNIQUE (video_id),
    CONSTRAINT chk_season_episode_positive CHECK (season > 0 AND episode_number > 0)
);

CREATE INDEX IF NOT EXISTS idx_episodes_series ON episodes(serie_id);
CREATE INDEX IF NOT EXISTS idx_episodes_video ON episodes(video_id);




----------------------------------------------------------------------
-- Tabla: movies
----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS movies (
    id SERIAL PRIMARY KEY,
    cover_image VARCHAR(64) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,         -- Título de la película
    title_normalized VARCHAR(255) GENERATED ALWAYS AS (LOWER(title)) STORED,
    description TEXT,                      -- Descripción opcional
    category_id INT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT, -- Relación con la categoría
    video_id INT NOT NULL REFERENCES videos(id) ON DELETE CASCADE,    -- Relación con el video correspondiente
    release_year INT NOT NULL CHECK (release_year BETWEEN 1900 AND EXTRACT(YEAR FROM CURRENT_DATE)),  -- Año de lanzamiento
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Fecha de actualización
    CONSTRAINT unique_movies_title_year UNIQUE (title_normalized, release_year), -- Garantiza unicidad por título y año
    CONSTRAINT unique_movie_video UNIQUE (video_id)
);

CREATE INDEX IF NOT EXISTS idx_movies_title ON movies(title_normalized);
CREATE INDEX IF NOT EXISTS idx_movies_category ON movies(category_id);
CREATE INDEX IF NOT EXISTS idx_movies_video ON movies(video_id);
CREATE INDEX IF NOT EXISTS idx_movies_title_trgm ON movies USING GIN (title gin_trgm_ops);


----------------------------------------------------------------------
-- Tabla: audit_log (Sistema de Auditoría)
----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_log (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,
    record_id INT NOT NULL,
    operation VARCHAR(10) NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
    old_data JSONB,
    new_data JSONB,
    performed_at TIMESTAMPTZ DEFAULT NOW(),
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    ip_address VARCHAR(255)
);

CREATE INDEX IF NOT EXISTS idx_audit_table_record ON audit_log(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_audit_performed_at ON audit_log USING BRIN(performed_at);
CREATE INDEX IF NOT EXISTS idx_audit_old_data ON audit_log USING GIN (old_data);
CREATE INDEX IF NOT EXISTS idx_audit_new_data ON audit_log USING GIN (new_data);

----------------------------------------------------------------------
-- Función para el Trigger de Auditoría
----------------------------------------------------------------------
CREATE OR REPLACE FUNCTION log_audit()
RETURNS TRIGGER AS $$
DECLARE
    v_user_id INT;
    v_ip_address TEXT;
BEGIN
    BEGIN
        v_user_id := current_setting('app.current_user_id')::INT;
    EXCEPTION WHEN others THEN
        v_user_id := NULL;
    END;

    BEGIN
        v_ip_address := current_setting('app.client_ip')::TEXT;
    EXCEPTION WHEN others THEN
        v_ip_address := NULL;
    END;

    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_log(
            table_name,
            record_id,
            operation,
            new_data,
            user_id,
            ip_address
        ) VALUES (
            TG_TABLE_NAME,
            NEW.id,
            TG_OP,
            to_jsonb(NEW),
            v_user_id,
            v_ip_address
        );
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_log(
            table_name,
            record_id,
            operation,
            old_data,
            new_data,
            user_id,
            ip_address
        ) VALUES (
            TG_TABLE_NAME,
            NEW.id,
            TG_OP,
            to_jsonb(OLD),
            to_jsonb(NEW),
            v_user_id,
            v_ip_address
        );
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_log(
            table_name,
            record_id,
            operation,
            old_data,
            user_id,
            ip_address
        ) VALUES (
            TG_TABLE_NAME,
            OLD.id,
            TG_OP,
            to_jsonb(OLD),
            v_user_id,
            v_ip_address
        );
    END IF;

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

----------------------------------------------------------------------
-- Triggers para actualizar el campo updated_at automáticamente en cada actualización
----------------------------------------------------------------------
DO $$ 
DECLARE
    tbl TEXT;
BEGIN
    FOR tbl IN 
        SELECT tablename FROM pg_tables WHERE schemaname = 'public' 
        AND tablename IN ('users', 'roles', 'videos', 'series', 'episodes', 'movies', 'categories')
    LOOP
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = tbl AND column_name = 'updated_at') THEN
            EXECUTE format('
                CREATE TRIGGER update_%s_updated_at 
                BEFORE UPDATE ON %I
                FOR EACH ROW
                EXECUTE FUNCTION update_updated_at_column();', tbl, tbl);
        END IF;
    END LOOP;
END $$;


----------------------------------------------------------------------
-- Triggers de Auditoría para Tablas Clave
----------------------------------------------------------------------
CREATE TRIGGER audit_users
AFTER INSERT OR UPDATE OR DELETE ON users
FOR EACH ROW EXECUTE FUNCTION log_audit();

CREATE TRIGGER audit_roles
AFTER INSERT OR UPDATE OR DELETE ON roles
FOR EACH ROW EXECUTE FUNCTION log_audit();

CREATE TRIGGER audit_categories
AFTER INSERT OR UPDATE OR DELETE ON categories
FOR EACH ROW EXECUTE FUNCTION log_audit();

CREATE TRIGGER audit_videos
AFTER INSERT OR UPDATE OR DELETE ON videos
FOR EACH ROW EXECUTE FUNCTION log_audit();

CREATE TRIGGER audit_series
AFTER INSERT OR UPDATE OR DELETE ON series
FOR EACH ROW EXECUTE FUNCTION log_audit();

CREATE TRIGGER audit_episodes
AFTER INSERT OR UPDATE OR DELETE ON episodes
FOR EACH ROW EXECUTE FUNCTION log_audit();

CREATE TRIGGER audit_movies
AFTER INSERT OR UPDATE OR DELETE ON movies
FOR EACH ROW EXECUTE FUNCTION log_audit();

----------------------------------------------------------------------
-- Inserción condicional de categorías iniciales
----------------------------------------------------------------------
DO $$
    BEGIN
        INSERT INTO categories (name)
        SELECT *
        FROM unnest(ARRAY[
            'Acción', 'Comedia', 'Drama', 'Ciencia Ficción', 'Terror',
            'Romance', 'Animación', 'Documental', 'Aventura', 'Fantasía',
            'Misterio', 'Crimen', 'Musical', 'Histórico', 'Infantil'
        ]) AS category_name
        ON CONFLICT (name) DO NOTHING;
END $$;


DO $$
BEGIN
    INSERT INTO roles (name, description)
    VALUES 
        ('admin', 'Administrador del sistema'),
        ('editor', 'Gestor de contenido'),
        ('user', 'Usuario estándar')
    ON CONFLICT (name) DO NOTHING;
END $$;

DO $$
BEGIN
    INSERT INTO users (user_name, email, password, role_id)
    VALUES 
        ('admin','admin@mail.com', '$2b$10$zQi8jhrrGemGp2WeiPcWEufIb3W5nn0c7bdhwckaRp4nYQBYqAeAO', 1)
    ON CONFLICT (user_name) DO NOTHING;
END $$;