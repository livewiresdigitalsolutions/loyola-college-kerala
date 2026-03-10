-- ============================================================
-- Loyola Mentoring Programme (LMP) — MySQL Schema
-- ============================================================

CREATE TABLE IF NOT EXISTS lmp_organizing_team (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(255)  NOT NULL,
    role          VARCHAR(255)  NOT NULL,
    image_url     VARCHAR(500)  DEFAULT '',
    display_order INT           DEFAULT 0,
    is_active     BOOLEAN       DEFAULT TRUE,
    created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lmp_sessions (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    date          VARCHAR(100)  NOT NULL,
    batch         VARCHAR(255)  NOT NULL,
    description   TEXT          NOT NULL,
    report_link   VARCHAR(500)  DEFAULT '',
    display_order INT           DEFAULT 0,
    is_active     BOOLEAN       DEFAULT TRUE,
    created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);
