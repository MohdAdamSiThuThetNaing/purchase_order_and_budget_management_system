CREATE TABLE budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL
        REFERENCES organizations(id) ON DELETE CASCADE,

    project_id UUID NOT NULL
        REFERENCES projects(id) ON DELETE CASCADE,

    name VARCHAR(150) NOT NULL,

    description VARCHAR(500),

    total_budget NUMERIC(14,2) NOT NULL DEFAULT 0
        CHECK (total_budget >= 0),

    active BOOLEAN NOT NULL DEFAULT TRUE,

    created_by UUID NOT NULL
        REFERENCES users(id),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    version INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_budgets_organization_id
    ON budgets (organization_id);

CREATE INDEX idx_budgets_project_id
    ON budgets (project_id);


CREATE TABLE budget_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL
        REFERENCES organizations(id) ON DELETE CASCADE,

    project_id UUID NOT NULL
        REFERENCES projects(id) ON DELETE CASCADE,

    budget_id UUID NOT NULL
        REFERENCES budgets(id) ON DELETE CASCADE,

    name VARCHAR(100) NOT NULL,

    description VARCHAR(500),

    active BOOLEAN NOT NULL DEFAULT TRUE,

    created_by UUID NOT NULL
        REFERENCES users(id),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    version INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_budget_categories_project_id
    ON budget_categories (project_id);

CREATE INDEX idx_budget_categories_budget_id
    ON budget_categories (budget_id);


CREATE TABLE budget_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL REFERENCES organizations(id),
    project_id UUID NOT NULL REFERENCES projects(id),
    budget_id UUID NOT NULL REFERENCES budgets(id),
    budget_category_id UUID NOT NULL REFERENCES budget_categories(id),

    name VARCHAR(150) NOT NULL,
    description VARCHAR(500),

    active BOOLEAN NOT NULL DEFAULT TRUE,

    budget_amount NUMERIC(14,2) NOT NULL,
    committed_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
    actual_amount NUMERIC(14,2) NOT NULL DEFAULT 0,

    created_by UUID NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    version INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_budget_lines_category_id
    ON budget_lines (budget_category_id);