BEGIN;

DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user'
        CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT users_username_not_blank CHECK (length(btrim(username)) > 0),
    CONSTRAINT users_username_trimmed CHECK (username = btrim(username)),
    CONSTRAINT users_password_hash_not_blank CHECK (length(password_hash) > 0)
);

CREATE UNIQUE INDEX users_username_lower_unique ON users (lower(username));

CREATE TABLE movies (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tmdb_id INTEGER NOT NULL UNIQUE,
    CONSTRAINT movies_tmdb_id_positive CHECK (tmdb_id > 0)
);

CREATE TABLE groups (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    visibility TEXT NOT NULL DEFAULT 'private'
        CHECK (visibility IN ('public', 'private')),
    creator_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT groups_name_not_blank CHECK (length(btrim(name)) > 0)
);

CREATE TABLE group_members (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    group_id INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member'
        CHECK (role IN ('member', 'admin')),
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT group_members_group_user_unique UNIQUE (group_id, user_id)
);

CREATE TABLE group_messages (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    group_id INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT group_messages_content_not_blank CHECK (length(btrim(content)) > 0)
);

CREATE TABLE group_invitations (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    group_id INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    invited_by INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    token_hash TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,
    CONSTRAINT group_invitations_token_hash_not_blank
        CHECK (length(btrim(token_hash)) > 0),
    CONSTRAINT group_invitations_expiry_after_creation
        CHECK (expires_at IS NULL OR expires_at > created_at),
    CONSTRAINT group_invitations_revoked_after_creation
        CHECK (revoked_at IS NULL OR revoked_at >= created_at)
);

CREATE TABLE group_join_requests (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    group_id INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    invitation_id INTEGER REFERENCES group_invitations(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    decided_at TIMESTAMPTZ,
    decided_by INTEGER REFERENCES users(id) ON DELETE SET NULL
);

-- Käyttäjällä voi olla samaan ryhmään vain yksi käsittelemätön pyyntö kerrallaan
CREATE UNIQUE INDEX group_join_requests_one_pending
    ON group_join_requests (group_id, user_id)
    WHERE status = 'pending';

CREATE INDEX group_messages_group_created ON group_messages (group_id, created_at);

CREATE TABLE reviews (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    movie_id INTEGER NOT NULL REFERENCES movies(id) ON DELETE RESTRICT,
    group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    visibility TEXT NOT NULL DEFAULT 'public'
        CHECK (visibility IN ('public', 'private')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE group_posts (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    group_id INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    movie_id INTEGER NOT NULL REFERENCES movies(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE group_comments (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES group_posts(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT group_comments_content_not_blank CHECK (length(btrim(content)) > 0)
);

CREATE TABLE movie_lists (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    visibility TEXT NOT NULL DEFAULT 'private'
        CHECK (visibility IN ('public', 'private', 'unlisted')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT movie_lists_name_not_blank CHECK (length(btrim(name)) > 0)
);

CREATE TABLE list_items (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    list_id INTEGER NOT NULL REFERENCES movie_lists(id) ON DELETE CASCADE,
    movie_id INTEGER NOT NULL REFERENCES movies(id) ON DELETE RESTRICT,
    added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT list_items_list_movie_unique UNIQUE (list_id, movie_id)
);

INSERT INTO users (username, password_hash) VALUES ('testikayttaja', 'ei-oikea-hash');

COMMIT;