-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Table: Income
create table income (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  amount numeric not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table income enable row level security;

create policy "Users can view their own income" on income
  for select using (auth.uid() = user_id);

create policy "Users can insert their own income" on income
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own income" on income
  for update using (auth.uid() = user_id);

create policy "Users can delete their own income" on income
  for delete using (auth.uid() = user_id);

-- Table: Expenses
-- Table: Expenses
create table expenses (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  amount numeric, -- Can be null for installments if we only use total_amount
  category text not null,
  created_date timestamp with time zone default timezone('utc'::text, now()) not null,
  due_month integer,
  due_year integer,
  is_installment boolean default false,
  installment_total integer,
  total_amount numeric, -- Total purchase amount for installments
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table expenses enable row level security;

create policy "Users can view their own expenses" on expenses
  for select using (auth.uid() = user_id);

create policy "Users can insert their own expenses" on expenses
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own expenses" on expenses
  for update using (auth.uid() = user_id);

create policy "Users can delete their own expenses" on expenses
  for delete using (auth.uid() = user_id);

-- Table: Expense Installments
create table expense_installments (
  id uuid default uuid_generate_v4() primary key,
  expense_id uuid references expenses(id) on delete cascade not null,
  user_id uuid references auth.users not null,
  installment_number integer not null,
  installment_total integer not null,
  amount numeric not null,
  due_month integer not null,
  due_year integer not null,
  paid boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table expense_installments enable row level security;

create policy "Users can view their own installments" on expense_installments
  for select using (auth.uid() = user_id);

create policy "Users can insert their own installments" on expense_installments
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own installments" on expense_installments
  for update using (auth.uid() = user_id);

create policy "Users can delete their own installments" on expense_installments
  for delete using (auth.uid() = user_id);
