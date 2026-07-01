
CREATE TYPE notification_type AS ENUM (
    'PO_SUBMITTED',
    'PO_APPROVED',
    'PO_REJECTED',
    'BUDGET_EXCEEDED'
);

CREATE TABLE notifications (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    type        notification_type NOT NULL,
    title       VARCHAR(150) NOT NULL,
    message     TEXT NOT NULL,
    is_read     BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user_id ON notifications (user_id);
CREATE INDEX idx_notifications_user_unread ON notifications (user_id, is_read) WHERE is_read = FALSE;
