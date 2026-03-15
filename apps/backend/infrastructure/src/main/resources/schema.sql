CREATE TABLE IF NOT EXISTS users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    enabled BOOLEAN DEFAULT FALSE,
    verification_code BIGINT,
    verification_expiration TIMESTAMP
);
