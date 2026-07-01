
CREATE TABLE approval_workflows (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations (id) ON DELETE CASCADE,
    name            VARCHAR(150) NOT NULL, -- e.g. "Standard PO Approval Flow"
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_approval_workflows_org_name UNIQUE (organization_id, name)
);

CREATE TABLE approval_steps (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    approval_workflow_id UUID NOT NULL REFERENCES approval_workflows (id) ON DELETE CASCADE,
    step_order          INTEGER NOT NULL, -- 1 = Manager, 2 = Finance, 3 = Producer, etc.
    role_id             UUID NOT NULL REFERENCES roles (id),
    name                VARCHAR(100) NOT NULL, -- display label, e.g. "Manager Approval"
    CONSTRAINT uq_approval_steps_workflow_order UNIQUE (approval_workflow_id, step_order)
);

CREATE INDEX idx_approval_workflows_org_id ON approval_workflows (organization_id);
CREATE INDEX idx_approval_steps_workflow_id ON approval_steps (approval_workflow_id);
CREATE INDEX idx_approval_steps_role_id ON approval_steps (role_id);
