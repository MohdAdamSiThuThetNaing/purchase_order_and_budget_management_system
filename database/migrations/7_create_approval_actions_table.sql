
CREATE TYPE approval_action_type AS ENUM ('APPROVE', 'REJECT', 'RESUBMIT');

CREATE TABLE approval_actions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    purchase_order_id   UUID NOT NULL REFERENCES purchase_orders (id) ON DELETE CASCADE,
    approval_step_id    UUID REFERENCES approval_steps (id),
    acted_by            UUID NOT NULL REFERENCES users (id),
    action              approval_action_type NOT NULL,
    comment              TEXT,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_approval_actions_po_id ON approval_actions (purchase_order_id);
CREATE INDEX idx_approval_actions_acted_by ON approval_actions (acted_by);
CREATE INDEX idx_approval_actions_created_at ON approval_actions (created_at);
