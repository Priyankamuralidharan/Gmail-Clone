// js/storage.js — localStorage init + CRUD helpers for email data

const STORAGE_KEY = "gmail_clone_emails";

const Storage = {
  init() {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (!existing) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_EMAILS));
    }
  },

  getAll() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  },

  saveAll(emails) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(emails));
  },

  getById(id) {
    return this.getAll().find((e) => e.id === id);
  },

  update(id, changes) {
    const emails = this.getAll();
    const idx = emails.findIndex((e) => e.id === id);
    if (idx === -1) return null;
    emails[idx] = { ...emails[idx], ...changes };
    this.saveAll(emails);
    return emails[idx];
  },

  add(email) {
    const emails = this.getAll();
    emails.unshift(email);
    this.saveAll(emails);
    return email;
  },

  remove(id) {
    const emails = this.getAll().filter((e) => e.id !== id);
    this.saveAll(emails);
  },

  resetToDefaults() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_EMAILS));
  },

  newId() {
    return "e" + Date.now() + Math.floor(Math.random() * 1000);
  }
};
