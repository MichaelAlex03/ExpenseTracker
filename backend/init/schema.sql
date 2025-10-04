CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    user_email TEXT UNIQUE,
    first_name TEXT,
    last_name TEXT,
    user_password TEXT,
    refresh_token TEXT NOT NULL,
    profile_image_key TEXT,
    phone_number TEXT,
    date_of_birth TIMESTAMP,
    occupation TEXT,
    user_location TEXT,
    profile_image TEXT
);

CREATE TABLE income (
    id SERIAL PRIMARY KEY
    date_of_income TIMESTAMP,
    income_amount TEXT,
    income_category TEXT,
    income_frequency TEXT,
    additional_notes TEXT,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    income_description TEXT
);

CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    date_of_expense TEXT,
    expense_description TEXT,
    expense_amount TEXT,
    expense_category TEXT,
    expense_payment_method TEXT,
    additional_notes TEXT,
    user_id REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE budgets (
    id SERIAL PRIMARY KEY,
    budget_name TEXT,
    budget_category TEXT,
    budget_limit TEXT,
    budget_notes TEXT,
    recurring TEXT,
    user_id REFERENCES users(id) ON DELETE CASCADE,
    budget_date TIMESTAMP
);