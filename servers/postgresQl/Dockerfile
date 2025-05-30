FROM postgres:17

# Instala postgresql-contrib para usar extensiones como pg_trgm
RUN apt-get update && \
    apt-get install -y postgresql-contrib && \
    rm -rf /var/lib/apt/lists/*
