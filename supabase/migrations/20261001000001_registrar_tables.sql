-- Supabase Database Migration for ISIM College ERP Registrar Panel
-- Generated: 2026-10-01

-- 1. Departments Master Table
CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Programs Master Table
CREATE TABLE IF NOT EXISTS programs (
    id SERIAL PRIMARY KEY,
    program_name VARCHAR(100) NOT NULL,
    program_code VARCHAR(30) UNIQUE NOT NULL,
    department_code VARCHAR(20),
    degree VARCHAR(50),
    specialization VARCHAR(100),
    duration_years INTEGER DEFAULT 4,
    semesters INTEGER DEFAULT 8,
    intake INTEGER DEFAULT 60,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Faculty Master Table
CREATE TABLE IF NOT EXISTS faculty (
    id SERIAL PRIMARY KEY,
    faculty_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    department VARCHAR(50),
    designation VARCHAR(50),
    qualification VARCHAR(100),
    mobile VARCHAR(20),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Subjects Master Table
CREATE TABLE IF NOT EXISTS subjects (
    id SERIAL PRIMARY KEY,
    subject_code VARCHAR(30) UNIQUE NOT NULL,
    subject_name VARCHAR(150) NOT NULL,
    department_code VARCHAR(20),
    program_code VARCHAR(30),
    semester INTEGER DEFAULT 1,
    credits INTEGER DEFAULT 4,
    type VARCHAR(30) DEFAULT 'Core',
    faculty_name VARCHAR(100),
    capacity INTEGER DEFAULT 60,
    registered_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Sections Master Table
CREATE TABLE IF NOT EXISTS sections (
    id SERIAL PRIMARY KEY,
    section_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(20) NOT NULL DEFAULT 'A',
    department_code VARCHAR(20),
    program_code VARCHAR(30),
    semester INTEGER DEFAULT 1,
    academic_year VARCHAR(30) DEFAULT '2026–27',
    batch VARCHAR(30) DEFAULT '2026-2030',
    capacity INTEGER DEFAULT 60,
    student_count INTEGER DEFAULT 0,
    class_advisor VARCHAR(100),
    status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Safely add missing columns to sections if pre-existed
ALTER TABLE sections ADD COLUMN IF NOT EXISTS section_code VARCHAR(50);
ALTER TABLE sections ADD COLUMN IF NOT EXISTS name VARCHAR(20) DEFAULT 'A';
ALTER TABLE sections ADD COLUMN IF NOT EXISTS semester INTEGER DEFAULT 1;
ALTER TABLE sections ADD COLUMN IF NOT EXISTS academic_year VARCHAR(30) DEFAULT '2026–27';
ALTER TABLE sections ADD COLUMN IF NOT EXISTS batch VARCHAR(30) DEFAULT '2026-2030';
ALTER TABLE sections ADD COLUMN IF NOT EXISTS student_count INTEGER DEFAULT 0;
ALTER TABLE sections ADD COLUMN IF NOT EXISTS class_advisor VARCHAR(100);
ALTER TABLE sections ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'Active';

-- 6. University & Affiliation Details Table
CREATE TABLE IF NOT EXISTS university_affiliations (
    id SERIAL PRIMARY KEY,
    name TEXT,
    university_name TEXT,
    code TEXT,
    university_code TEXT,
    established TEXT,
    established_year TEXT,
    type TEXT,
    institution_type TEXT,
    accreditation TEXT,
    vice_chancellor TEXT,
    registrar TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zip TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    affiliation_status TEXT DEFAULT 'Active',
    status TEXT DEFAULT 'Active',
    valid_until TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Enable Public Row-Level Security Policies for Development
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE university_affiliations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Departments Policy" ON departments;
CREATE POLICY "Public Departments Policy" ON departments FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Programs Policy" ON programs;
CREATE POLICY "Public Programs Policy" ON programs FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Faculty Policy" ON faculty;
CREATE POLICY "Public Faculty Policy" ON faculty FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Subjects Policy" ON subjects;
CREATE POLICY "Public Subjects Policy" ON subjects FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Sections Policy" ON sections;
CREATE POLICY "Public Sections Policy" ON sections FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Affiliations Policy" ON university_affiliations;
CREATE POLICY "Public Affiliations Policy" ON university_affiliations FOR ALL USING (true) WITH CHECK (true);
