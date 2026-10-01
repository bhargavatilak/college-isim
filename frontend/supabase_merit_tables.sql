-- Merit / Selection Tables

-- 1. Selection Rounds
CREATE TABLE selection_rounds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    round_name VARCHAR(100) NOT NULL, -- e.g., 'Round 1 (General)', 'Round 2 (Waiting)'
    academic_year VARCHAR(20) NOT NULL,
    program_code VARCHAR(50) NOT NULL,
    total_seats INT NOT NULL,
    start_date DATE,
    end_date DATE,
    status VARCHAR(50) DEFAULT 'Draft', -- 'Draft', 'Active', 'Completed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Merit Criteria (Rules for calculation)
CREATE TABLE merit_criteria (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_code VARCHAR(50) NOT NULL,
    criteria_name VARCHAR(100) NOT NULL, -- e.g., '12th PCM', 'Entrance Exam'
    weightage DECIMAL(5,2) NOT NULL, -- e.g., 60.00 for 60%
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Admission Merit Records (The generated list)
CREATE TABLE admission_merit_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admission_number VARCHAR(100) UNIQUE, -- Link to student/application
    student_name VARCHAR(255) NOT NULL,
    program_code VARCHAR(50) NOT NULL,
    department_code VARCHAR(50),
    category VARCHAR(50) DEFAULT 'General', -- 'General', 'OBC', 'SC', 'ST'
    entrance_score DECIMAL(5,2),
    academic_score DECIMAL(5,2), -- e.g., 12th percentage
    total_merit_score DECIMAL(5,2), -- Calculated based on criteria weightage
    merit_rank INT,
    selection_status VARCHAR(50) DEFAULT 'Pending', -- 'Selected', 'Waitlisted', 'Rejected', 'Pending'
    round_id UUID REFERENCES selection_rounds(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Merit History (Audit trail of changes)
CREATE TABLE merit_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merit_record_id UUID REFERENCES admission_merit_records(id) ON DELETE CASCADE,
    previous_status VARCHAR(50),
    new_status VARCHAR(50),
    changed_by VARCHAR(100), -- User or System
    remarks TEXT,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Example Policies (assuming RLS is needed, but we keep it open for ease of use in dashboard)
-- ALTER TABLE selection_rounds ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Enable read/write for authenticated users" ON selection_rounds FOR ALL USING (auth.role() = 'authenticated');
-- (and so on)
