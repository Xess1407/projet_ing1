CREATE TABLE IF NOT EXISTS analytics (
    data_project_id NUMBER NOT NULL,
    user_id NUMBER NOT NULL,
    file_name TEXT NOT NULL,
    json_data TEXT NOT NULL
);