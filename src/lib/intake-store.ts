// Tymczasowy file-based store dla intake_projects (zamiast Supabase)
// Dane trzymane w .intake-store.json w katalogu projektu
// Zamień na Supabase gdy tabela będzie gotowa

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';
import type { IntakeProject } from './client-data';

const STORE_PATH = join(process.cwd(), '.intake-store.json');

function readStore(): Record<string, IntakeProject> {
  if (!existsSync(STORE_PATH)) return {};
  try {
    return JSON.parse(readFileSync(STORE_PATH, 'utf-8'));
  } catch {
    return {};
  }
}

function writeStore(data: Record<string, IntakeProject>): void {
  writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

export function storeCreate(
  payload: Omit<IntakeProject, 'id' | 'enrichment_json' | 'metaprompt' | 'status' | 'created_at'>
): IntakeProject {
  const store = readStore();
  const project: IntakeProject = {
    ...payload,
    id: randomUUID(),
    enrichment_json: null,
    metaprompt: null,
    status: 'raw',
    created_at: new Date().toISOString(),
  };
  store[project.id] = project;
  writeStore(store);
  return project;
}

export function storeGetAll(): IntakeProject[] {
  const store = readStore();
  return Object.values(store).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function storeGetById(id: string): IntakeProject {
  const store = readStore();
  const project = store[id];
  if (!project) throw new Error(`Nie znaleziono intake project: ${id}`);
  return project;
}

export function storeUpdateEnrichment(
  id: string,
  enrichment: Record<string, unknown>,
  metaprompt: string
): void {
  const store = readStore();
  if (!store[id]) throw new Error(`Nie znaleziono intake project: ${id}`);
  store[id].enrichment_json = enrichment;
  store[id].metaprompt = metaprompt;
  store[id].status = 'ready';
  writeStore(store);
}

export function storeUpdateStatus(id: string, status: string): void {
  const store = readStore();
  if (!store[id]) throw new Error(`Nie znaleziono intake project: ${id}`);
  store[id].status = status;
  writeStore(store);
}

export function storeUpdate(
  id: string,
  payload: Partial<Omit<IntakeProject, 'id' | 'created_at'>>
): void {
  const store = readStore();
  if (!store[id]) throw new Error(`Nie znaleziono intake project: ${id}`);
  store[id] = { ...store[id], ...payload };
  writeStore(store);
}
