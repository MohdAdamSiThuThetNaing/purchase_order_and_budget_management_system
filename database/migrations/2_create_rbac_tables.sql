
CREATE TABLE roles (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations (id) ON DELETE CASCADE,
    name            VARCHAR(100) NOT NULL,
    description     VARCHAR(255),
    is_system       BOOLEAN NOT NULL DEFAULT FALSE, -- e.g. Admin, Manager, Finance, Producer, Employee
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_roles_org_name UNIQUE (organization_id, name)
);

CREATE TABLE permissions (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code        VARCHAR(100) NOT NULL, -- e.g. CREATE_PO, SUBMIT_PO, APPROVE_PO, VIEW_BUDGET
    description VARCHAR(255),
    CONSTRAINT uq_permissions_code UNIQUE (code)
);

CREATE TABLE user_roles (
    user_id     UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    role_id     UUID NOT NULL REFERENCES roles (id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE role_permissions (
    role_id       UUID NOT NULL REFERENCES roles (id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions (id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE refresh_tokens (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    token_hash  VARCHAR(255) NOT NULL,
    expires_at  TIMESTAMPTZ NOT NULL,
    revoked_at  TIMESTAMPTZ,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_refresh_tokens_hash UNIQUE (token_hash)
);

CREATE INDEX idx_roles_organization_id ON roles (organization_id);
CREATE INDEX idx_user_roles_role_id ON user_roles (role_id);
CREATE INDEX idx_role_permissions_permission_id ON role_permissions (permission_id);
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens (user_id);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens (expires_at);
