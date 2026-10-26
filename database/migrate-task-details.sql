-- Uruchom raz dla bazy utworzonej przed integracją frontendu.
-- Istniejące zadania dostają średni priorytet; termin pozostaje pusty.
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS priority VARCHAR(10) NOT NULL DEFAULT 'medium';
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS due_date DATE;
