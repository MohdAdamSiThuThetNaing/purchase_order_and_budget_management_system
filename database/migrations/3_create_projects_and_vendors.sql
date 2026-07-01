

CREATE TABLE projects (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations (id) ON DELETE CASCADE,
    name            VARCHAR(150) NOT NULL,
    code            VARCHAR(50),
    description     TEXT,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_by      UUID REFERENCES users (id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_projects_org_code UNIQUE (organization_id, code)
);

CREATE TABLE vendors (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations (id) ON DELETE CASCADE,
    name            VARCHAR(150) NOT NULL,
    contact_email   VARCHAR(255),
    contact_phone   VARCHAR(50),
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_vendors_org_name UNIQUE (organization_id, name)
);

CREATE INDEX idx_projects_organization_id ON projects (organization_id);
CREATE INDEX idx_vendors_organization_id ON vendors (organization_id);
