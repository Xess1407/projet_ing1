CREATE TABLE IF NOT EXISTS message (
  emitter TEXT NOT NULL,
  receiver TEXT NOT NULL,
  content TEXT NOT NULL,
  date TEXT NOT NULL
);