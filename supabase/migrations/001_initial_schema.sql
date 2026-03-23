-- =============================================
-- Bokbok - Kundapp databasstruktur
-- Kör denna SQL i Supabase Dashboard
-- =============================================

-- Tjänster
create table if not exists public.services (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price integer not null default 0,
  duration_minutes integer not null default 60,
  active boolean default true,
  created_at timestamp with time zone default timezone('utc', now())
);

-- Personal (stylists)
create table if not exists public.staff (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  full_name text not null,
  email text,
  role text default 'stylist',
  created_at timestamp with time zone default timezone('utc', now())
);

-- Bokningar
create table if not exists public.bookings (
  id uuid default gen_random_uuid() primary key,
  customer_id uuid references auth.users(id),
  customer_email text,
  customer_name text,
  service_id uuid references public.services(id),
  staff_id uuid references public.staff(id),
  date date not null,
  start_time text not null,
  end_time text,
  status text default 'pending',
  notes text,
  created_at timestamp with time zone default timezone('utc', now())
);

-- Row Level Security
alter table public.services enable row level security;
alter table public.staff enable row level security;
alter table public.bookings enable row level security;

-- Policies

-- Services: alla kan se aktiva tjänster
create policy "Alla kan se aktiva tjänster"
  on public.services for select
  using (active = true);

-- Staff: alla kan se personal
create policy "Alla kan se personal"
  on public.staff for select
  using (true);

-- Bookings: användare ser sina egna bokningar
create policy "Användare ser sina egna bokningar"
  on public.bookings for select
  using (auth.uid() = customer_id);

-- Bookings: användare kan skapa egna bokningar
create policy "Användare kan skapa bokningar"
  on public.bookings for insert
  with check (auth.uid() = customer_id);

-- Bookings: användare kan uppdatera sina egna väntande bokningar
create policy "Användare kan uppdatera egna väntande bokningar"
  on public.bookings for update
  using (auth.uid() = customer_id and status = 'pending');

-- =============================================
-- SEED DATA - Lägg till exempeltjänster
-- =============================================

insert into public.services (name, description, price, duration_minutes) values
  ('Klippning', 'Standard klippning inklusive tvätt', 450, 45),
  ('Heruklippning', 'Klippning för herrar', 350, 30),
  ('Färgning', 'Helkroppsfärg inklusive toning', 1200, 120),
  ('Highlights', 'Färgning av enstaka slingor', 800, 90),
  ('Toning', 'Tonande behandling', 600, 60),
  ('Bokning', 'Enkel bokning utan behandling', 300, 30),
  ('Hårvård', 'Djup Conditioner och styling', 400, 45),
  ('Kill & Burn', 'Klippning och rakning', 500, 60);
