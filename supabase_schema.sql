-- TechnoFest 2026 PostgreSQL Schema

-- 1. Create the base 'registrations' table
CREATE TABLE registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    registration_ref TEXT UNIQUE NOT NULL, -- The short readable fetch ID (e.g. FEST-1234)
    team_name TEXT NOT NULL,
    event_id TEXT NOT NULL,
    leader_name TEXT NOT NULL,
    leader_email TEXT NOT NULL,
    leader_phone TEXT NOT NULL,
    leader_college TEXT NOT NULL,
    abstract_text TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending',
    fee_paid INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create the child 'team_members' table
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    registration_id UUID NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    college TEXT NOT NULL
);

-- 4. Set up Row Level Security (RLS) for the tables
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (Registration Form)
CREATE POLICY "Allow public inserts" ON registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public inserts" ON team_members FOR INSERT WITH CHECK (true);

-- Allow public reads for the current static site flow.
-- If you later add privileged dashboards or APIs, tighten these policies accordingly.
CREATE POLICY "Allow public SELECT" ON registrations FOR SELECT USING (true);
CREATE POLICY "Allow public SELECT" ON team_members FOR SELECT USING (true);
