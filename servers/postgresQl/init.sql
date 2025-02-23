CREATE TABLE IF NOT EXISTS users (
    id serial NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    role character varying NOT NULL,
    recovery_token character varying,
    creation_date timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE (email)
);

-- Crear la tabla `categories`
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE -- Nombre único de la categoría
);

-- Crear la tabla `videos`
CREATE TABLE IF NOT EXISTS videos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL, -- Título del video
    description TEXT, -- Descripción opcional
    category_id INT REFERENCES categories(id), -- Relación con la categoría
    file_path VARCHAR(255) NOT NULL, -- Ruta del archivo en MinIO
    minio_folder VARCHAR(255),
    file_hash VARCHAR(64) UNIQUE,
    duration INTERVAL, -- Duración del video (opcional)
    views INT DEFAULT 0, -- Número de visualizaciones
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Fecha de actualización
);

-- Crear la tabla `series`
CREATE TABLE IF NOT EXISTS series (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL, -- Título de la serie
    description TEXT, -- Descripción opcional
    category_id INT REFERENCES categories(id), -- Relación con la categoría
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Fecha de actualización
);

-- Crear la tabla `episodes`
CREATE TABLE IF NOT EXISTS episodes (
    id SERIAL PRIMARY KEY,
    series_id INT REFERENCES series(id), -- Relación con la serie
    title VARCHAR(255) NOT NULL, -- Título del episodio
    season INT NOT NULL, -- Temporada del episodio
    episode_number INT NOT NULL, -- Número del episodio
    video_id INT REFERENCES videos(id), -- Relación con el video correspondiente
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Fecha de actualización
);

-- Crear la tabla `movies`
CREATE TABLE IF NOT EXISTS movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL, -- Título de la película
    description TEXT, -- Descripción opcional
    category_id INT REFERENCES categories(id), -- Relación con la categoría
    video_id INT REFERENCES videos(id), -- Relación con el video correspondiente
    release_year INT, -- Año de lanzamiento
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Fecha de actualización
);

-- Insertar categorías iniciales en la tabla `categories`
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Acción') THEN
        INSERT INTO categories (name) VALUES
        ('Acción'),          -- Películas o series de acción
        ('Comedia'),         -- Contenido humorístico
        ('Drama'),           -- Historias emocionales y serias
        ('Ciencia Ficción'), -- Películas o series de ciencia ficción
        ('Terror'),          -- Contenido de suspenso y miedo
        ('Romance'),         -- Historias de amor
        ('Animación'),       -- Contenido animado (películas o series)
        ('Documental'),      -- Documentales informativos
        ('Aventura'),        -- Aventuras emocionantes
        ('Fantasía'),        -- Mundos mágicos y fantásticos
        ('Misterio'),        -- Historias de misterio y detectives
        ('Crimen'),          -- Contenido relacionado con crimen
        ('Musical'),         -- Películas o series con música central
        ('Histórico'),       -- Contenido basado en eventos históricos
        ('Infantil');        -- Contenido para niños
    END IF;
END $$;
