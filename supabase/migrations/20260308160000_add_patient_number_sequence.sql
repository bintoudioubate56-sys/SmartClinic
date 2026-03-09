-- Migration: add_patient_number_sequence
-- Créer une séquence dédiée pour le numéro patient
-- Cela évite les race conditions lors d'insertions simultanées

CREATE SEQUENCE IF NOT EXISTS public.patient_number_seq
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;

COMMENT ON SEQUENCE public.patient_number_seq IS 'Séquence pour générer les numéros patient uniques (SC-YYYY-XXXXX)';
