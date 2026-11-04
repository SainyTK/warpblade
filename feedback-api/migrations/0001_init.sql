-- Player feedback for Warpblade.
CREATE TABLE feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  category TEXT NOT NULL CHECK (category IN ('bug', 'balance', 'idea', 'other')),
  message TEXT NOT NULL,
  name TEXT,
  game_version TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'planned', 'addressed', 'skipped', 'duplicate', 'hidden')),
  reply TEXT,
  patch TEXT,
  duplicate_of INTEGER REFERENCES feedback (id),
  votes INTEGER NOT NULL DEFAULT 0,
  ip_hash TEXT NOT NULL
);

CREATE INDEX feedback_status ON feedback (status);
CREATE INDEX feedback_ip_hash_created_at ON feedback (ip_hash, created_at);

-- One vote per player (IP hash) per item.
CREATE TABLE votes (
  feedback_id INTEGER NOT NULL REFERENCES feedback (id) ON DELETE CASCADE,
  ip_hash TEXT NOT NULL,
  PRIMARY KEY (feedback_id, ip_hash)
);
