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
create table expenses (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  amount numeric not null,
  category text not null,
  date timestamp with time zone default timezone('utc'::text, now()) not null,
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
