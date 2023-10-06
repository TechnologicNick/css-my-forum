import { randomBytes, randomUUID } from "crypto";
import NodeCache from "node-cache";
import asGlobalService from "./as-global-service";
import { digestMessage } from "./util";

if (typeof window !== "undefined") {
  throw new Error("This module is only for server-side use");
}

// Use in-memory cache to store forum data
export const forumCache = asGlobalService(() => new NodeCache({
  stdTTL: 60 * 60, // 1 hour
  useClones: false,
}), "forumCache");

export const createForum = (title: string, customCss: string) => {
  const id = randomUUID();
  const forum = { id, title, customCss };
  forumCache.set(id, forum);
  return forum;
};

export type Forum = ReturnType<typeof createForum>;

export const getForum = (id: string) => {
  return forumCache.get<Forum>(id);
};

export type User = {
  name: string;
  password: string;
  hash: string;
  isAdmin: boolean;
};

export const createUser = async (name: string, password: string) => {
  const hash = await digestMessage(password);
  const user = { name, password, hash, isAdmin: false };

  users.push(user);
  return user;
};

export const users: User[] = asGlobalService(() => {
  return [];
}, "users");

export const admin = (async () => {
  const adminPassword = randomBytes(16).toString("hex");
  const adminUser = await createUser("admin", adminPassword);
  adminUser.isAdmin = true;
  console.log(adminUser);
  return adminUser;
})();

export const login = (name: string, hash: string) => {
  return users.find((user) => user.name === name && user.hash === hash);
}

export const sessionCache = asGlobalService(() => new NodeCache({
  stdTTL: 60 * 60, // 1 hour
  useClones: false,
}), "sessionCache");

export const createSession = (user: User) => {
  const id = randomUUID();
  sessionCache.set(id, user);
  return id;
};

export type Session = ReturnType<typeof createSession>;

export const getSession = (id: string) => {
  return sessionCache.get<Session>(id);
};
