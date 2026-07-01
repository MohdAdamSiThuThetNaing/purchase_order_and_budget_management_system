

DO $$
DECLARE
    v_org_id               UUID;
    v_admin_id             UUID;
    v_manager_id           UUID;
    v_finance_id           UUID;
    v_employee_id          UUID;

    v_role_admin           UUID;
    v_role_manager         UUID;
    v_role_finance         UUID;
    v_role_employee        UUID;

    v_project_id           UUID;
    v_vendor_id            UUID;
    v_budget_id            UUID;
    v_category_camera      UUID;
    v_line_camera_rental   UUID;
    v_workflow_id          UUID;
BEGIN
    -- Idempotency guard: skip entirely if this demo org was already seeded.
    IF EXISTS (SELECT 1 FROM organizations WHERE slug = 'acme-productions') THEN
        RAISE NOTICE 'Seed data already present for acme-productions, skipping.';
        RETURN;
    END IF;

    INSERT INTO organizations (id, name, slug)
    VALUES (gen_random_uuid(), 'Acme Productions', 'acme-productions')
    RETURNING id INTO v_org_id;

    INSERT INTO roles (id, organization_id, name, description, is_system) VALUES
        (gen_random_uuid(), v_org_id, 'Admin', 'Full system access', TRUE),
        (gen_random_uuid(), v_org_id, 'Manager', 'Approves first-level requests', TRUE),
        (gen_random_uuid(), v_org_id, 'Finance', 'Approves budget-impacting requests', TRUE),
        (gen_random_uuid(), v_org_id, 'Employee', 'Creates purchase orders', TRUE);

    SELECT id INTO v_role_admin    FROM roles WHERE organization_id = v_org_id AND name = 'Admin';
    SELECT id INTO v_role_manager  FROM roles WHERE organization_id = v_org_id AND name = 'Manager';
    SELECT id INTO v_role_finance  FROM roles WHERE organization_id = v_org_id AND name = 'Finance';
    SELECT id INTO v_role_employee FROM roles WHERE organization_id = v_org_id AND name = 'Employee';

    -- Permissions are global, not per-org, so only insert ones that don't exist yet.
    INSERT INTO permissions (id, code, description) VALUES
        (gen_random_uuid(), 'CREATE_PO',     'Create purchase orders'),
        (gen_random_uuid(), 'SUBMIT_PO',     'Submit purchase orders'),
        (gen_random_uuid(), 'APPROVE_PO',    'Approve purchase orders'),
        (gen_random_uuid(), 'REJECT_PO',     'Reject purchase orders'),
        (gen_random_uuid(), 'VIEW_BUDGET',   'View budget reports'),
        (gen_random_uuid(), 'EDIT_BUDGET',   'Edit budget lines'),
        (gen_random_uuid(), 'MANAGE_USERS',  'Manage organization users')
    ON CONFLICT (code) DO NOTHING;

    -- Grant all permissions to Admin
    INSERT INTO role_permissions (role_id, permission_id)
    SELECT v_role_admin, id FROM permissions;

    -- Grant relevant permissions to Manager / Finance / Employee
    INSERT INTO role_permissions (role_id, permission_id)
    SELECT v_role_manager, id FROM permissions WHERE code IN ('APPROVE_PO', 'REJECT_PO', 'VIEW_BUDGET');

    INSERT INTO role_permissions (role_id, permission_id)
    SELECT v_role_finance, id FROM permissions WHERE code IN ('APPROVE_PO', 'REJECT_PO', 'VIEW_BUDGET', 'EDIT_BUDGET');

    INSERT INTO role_permissions (role_id, permission_id)
    SELECT v_role_employee, id FROM permissions WHERE code IN ('CREATE_PO', 'SUBMIT_PO', 'VIEW_BUDGET');

    -- Users (replace password_hash placeholders with real bcrypt hashes before use)
    INSERT INTO users (id, organization_id, email, password_hash, first_name, last_name)
    VALUES (gen_random_uuid(), v_org_id, 'admin@acme.test', '$2a$10$M0Iej.s8IXV6mFno9z3zkuExIZbUvV9oly/053I7L.Cq9HZ9iFzjC', 'Ada', 'Admin')
    RETURNING id INTO v_admin_id;

    INSERT INTO users (id, organization_id, email, password_hash, first_name, last_name)
    VALUES (gen_random_uuid(), v_org_id, 'manager@acme.test', '$2a$10$M0Iej.s8IXV6mFno9z3zkuExIZbUvV9oly/053I7L.Cq9HZ9iFzjC', 'Mark', 'Manager')
    RETURNING id INTO v_manager_id;

    INSERT INTO users (id, organization_id, email, password_hash, first_name, last_name)
    VALUES (gen_random_uuid(), v_org_id, 'finance@acme.test', '$2a$10$M0Iej.s8IXV6mFno9z3zkuExIZbUvV9oly/053I7L.Cq9HZ9iFzjC', 'Fiona', 'Finance')
    RETURNING id INTO v_finance_id;

    INSERT INTO users (id, organization_id, email, password_hash, first_name, last_name)
    VALUES (gen_random_uuid(), v_org_id, 'employee@acme.test', '$2a$10$M0Iej.s8IXV6mFno9z3zkuExIZbUvV9oly/053I7L.Cq9HZ9iFzjC', 'Eli', 'Employee')
    RETURNING id INTO v_employee_id;

    INSERT INTO user_roles (user_id, role_id) VALUES
        (v_admin_id,    v_role_admin),
        (v_manager_id,  v_role_manager),
        (v_finance_id,  v_role_finance),
        (v_employee_id, v_role_employee);

    -- Project
    INSERT INTO projects (id, organization_id, name, code, description, created_by)
    VALUES (gen_random_uuid(), v_org_id, 'Summer Commercial Shoot', 'SCS-2026', 'TV commercial production', v_admin_id)
    RETURNING id INTO v_project_id;

    -- Vendor
    INSERT INTO vendors (id, organization_id, name, contact_email)
    VALUES (gen_random_uuid(), v_org_id, 'Lens & Light Rentals Co.', 'orders@lensandlight.test')
    RETURNING id INTO v_vendor_id;

    -- Budget
    INSERT INTO budgets (
        id,
        organization_id,
        project_id,
        name,
        description,
        total_budget,
        active,
        created_by,
        created_at,
        updated_at,
        version
    )
    VALUES (
        gen_random_uuid(),
        v_org_id,
        v_project_id,
        'Production Budget',
        'Main production budget',
        100000.00,
        TRUE,
        v_admin_id,
        NOW(),
        NOW(),
        0
    )
    RETURNING id INTO v_budget_id;

    -- Budget category + lines
    INSERT INTO budget_categories (
        id,
        organization_id,
        project_id,
        budget_id,
        name,
        description,
        active,
        created_by,
        created_at,
        updated_at,
        version
    )
    VALUES (
        gen_random_uuid(),
        v_org_id,
        v_project_id,
        v_budget_id,
        'Camera',
        'Camera expenses',
        TRUE,
        v_admin_id,
        NOW(),
        NOW(),
        0
    )
    RETURNING id INTO v_category_camera;

    INSERT INTO budget_lines (
        id,
        organization_id,
        project_id,
        budget_id,
        budget_category_id,
        name,
        description,
        active,
        budget_amount,
        committed_amount,
        actual_amount,
        created_by,
        created_at,
        updated_at,
        version
    )
    VALUES (
        gen_random_uuid(),
        v_org_id,
        v_project_id,
        v_budget_id,
        v_category_camera,
        'Camera Rental',
        'Camera Rental',
        TRUE,
        5000.00,
        0,
        0,
        v_admin_id,
        NOW(),
        NOW(),
        0
    )
    RETURNING id INTO v_line_camera_rental;

    INSERT INTO budget_lines (
        organization_id,
        project_id,
        budget_id,
        budget_category_id,
        name,
        description,
        active,
        budget_amount,
        committed_amount,
        actual_amount,
        created_by,
        created_at,
        updated_at,
        version
    )
    VALUES
    (
        v_org_id,
        v_project_id,
        v_budget_id,
        v_category_camera,
        'Lens Rental',
        'Lens Rental',
        TRUE,
        2000.00,
        0,
        0,
        v_admin_id,
        NOW(),
        NOW(),
        0
    ),
    (
        v_org_id,
        v_project_id,
        v_budget_id,
        v_category_camera,
        'Batteries',
        'Batteries',
        TRUE,
        300.00,
        0,
        0,
        v_admin_id,
        NOW(),
        NOW(),
        0
    );

    -- Approval workflow: Manager -> Finance
    INSERT INTO approval_workflows (id, organization_id, name)
    VALUES (gen_random_uuid(), v_org_id, 'Standard PO Approval Flow')
    RETURNING id INTO v_workflow_id;

    INSERT INTO approval_steps (approval_workflow_id, step_order, role_id, name) VALUES
        (v_workflow_id, 1, v_role_manager, 'Manager Approval'),
        (v_workflow_id, 2, v_role_finance, 'Finance Approval');

    -- Sample draft purchase order
    INSERT INTO purchase_orders (
        organization_id, project_id, vendor_id, approval_workflow_id,
        po_number, status, created_by
    ) VALUES (
        v_org_id, v_project_id, v_vendor_id, v_workflow_id,
        'PO-2026-0001', 'DRAFT', v_employee_id
    );

    RAISE NOTICE 'Seed data created for organization: %', v_org_id;
END $$;