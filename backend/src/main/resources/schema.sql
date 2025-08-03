CREATE TABLE if NOT EXISTS config
(
    id        BIGINT auto_increment PRIMARY key,
    name      VARCHAR(100)      NOT NULL,
    value     longtext          NULL,
    is_public tinyint DEFAULT 0 NOT NULL,
    CONSTRAINT config_pk_2 UNIQUE (name)
);

CREATE TABLE if NOT EXISTS user
(
    id         BIGINT auto_increment PRIMARY key,
    username   VARCHAR(50)                         NOT NULL,
    password   VARCHAR(100)                        NOT NULL,
    salt       VARCHAR(20)                         NOT NULL,
    email      VARCHAR(100)                        NULL,
    role       VARCHAR(20)   DEFAULT 'USER'        NOT NULL comment 'ADMIN,USER',
    status     tinyint   DEFAULT 1                 NOT NULL comment '1:enabled; 0:disabled',
    api_key    VARCHAR(50)                         NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT user_pk_2 UNIQUE (username),
    CONSTRAINT user_pk_3 UNIQUE (email)
);

