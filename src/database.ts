import { randomBytes, randomUUID } from "crypto";
import NodeCache from "node-cache";
import asGlobalService from "./as-global-service";
import fs from "fs";
import { sha256 } from "js-sha256";

if (typeof window !== "undefined") {
  throw new Error("This module is only for server-side use");
}

// Use in-memory cache to store forum data
export const forumCache = asGlobalService(
  () =>
    new NodeCache({
      stdTTL: 60 * 60, // 1 hour
      useClones: false,
    }),
  "forumCache",
);

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

export const createUser = (name: string, password: string) => {
  const hash = sha256(password);
  const user = { name, password, hash, isAdmin: false };

  users.push(user);
  return user;
};

export const users: User[] = asGlobalService(() => {
  return [];
}, "users");

export const admin = asGlobalService(async () => {
  let adminPassword = randomBytes(16).toString("hex");
  if (process.env.NODE_ENV === "development") {
    if (fs.existsSync("admin-password.txt")) {
      adminPassword = fs.readFileSync("admin-password.txt", "utf-8");
    } else {
      console.log("Admin password file not found, creating one");
      fs.writeFileSync("admin-password.txt", adminPassword);
    }
  }

  const adminUser = await createUser("admin", adminPassword);
  adminUser.isAdmin = true;
  console.log(adminUser);
  return adminUser;
}, "admin");

export const login = (name: string, hash: string) => {
  return users.find((user) => user.name === name && user.hash === hash);
};

export const sessionCache = asGlobalService(
  () =>
    new NodeCache({
      stdTTL: 60 * 60, // 1 hour
      useClones: false,
    }),
  "sessionCache",
);

export const createSession = (user: User) => {
  const id = randomUUID();
  sessionCache.set(id, user);

  console.log(`Created session for ${user.name}`, { session: id });

  return id;
};

export type Session = ReturnType<typeof createSession>;

export const getUserBySession = (id: string) => {
  return sessionCache.get<User>(id);
};
