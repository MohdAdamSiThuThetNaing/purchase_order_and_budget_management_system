CREATE TYPE po_status AS ENUM (
    'DRAFT',
    'SUBMITTED',
    'APPROVED',
    'REJECTED',
    'CANCELLED'
);

CREATE TABLE purchase_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL
        REFERENCES organizations(id) ON DELETE CASCADE,

    project_id UUID NOT NULL
        REFERENCES projects(id) ON DELETE CASCADE,

    vendor_id UUID NOT NULL
        REFERENCES vendors(id),

    approval_workflow_id UUID
        REFERENCES approval_workflows(id),

    current_approval_step INTEGER NOT NULL DEFAULT 0,

    po_number VARCHAR(50) NOT NULL,

    status po_status NOT NULL DEFAULT 'DRAFT',

    total_amount NUMERIC(14,2) NOT NULL DEFAULT 0
        CHECK (total_amount >= 0),

    created_by UUID NOT NULL
        REFERENCES users(id),

    submitted_at TIMESTAMPTZ,

    decided_at TIMESTAMPTZ,

    version INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_purchase_orders_org_number
        UNIQUE (organization_id, po_number)
);

CREATE TABLE purchase_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    purchase_order_id UUID NOT NULL
        REFERENCES purchase_orders(id) ON DELETE CASCADE,

    budget_line_id UUID NOT NULL
        REFERENCES budget_lines(id),

    description VARCHAR(255) NOT NULL,

    quantity NUMERIC(12,2) NOT NULL
        CHECK (quantity > 0),

    unit_price NUMERIC(14,2) NOT NULL
        CHECK (unit_price >= 0),

    total NUMERIC(14,2)
        GENERATED ALWAYS AS (quantity * unit_price) STORED,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_purchase_orders_org_id
    ON purchase_orders (organization_id);

CREATE INDEX idx_purchase_orders_project_id
    ON purchase_orders (project_id);

CREATE INDEX idx_purchase_orders_vendor_id
    ON purchase_orders (vendor_id);

CREATE INDEX idx_purchase_orders_workflow_id
    ON purchase_orders (approval_workflow_id);

CREATE INDEX idx_purchase_orders_status
    ON purchase_orders (status);

CREATE INDEX idx_po_items_purchase_order_id
    ON purchase_order_items (purchase_order_id);

CREATE INDEX idx_po_items_budget_line_id
    ON purchase_order_items (budget_line_id);