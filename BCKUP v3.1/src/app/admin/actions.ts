"use server";

import { cookies, headers } from "next/headers";
import { redis } from "@/lib/redis";
import { Creator } from "@/lib/creators";
import { 
  getCreatorsFromDb, 
  saveCreatorsToDb, 
  getSiteSettingsFromDb, 
  saveSiteSettingsToDb, 
  SiteSettings,
  getNewsFromDb,
  saveNewsToDb
} from "@/lib/creators-db";
import { Article } from "@/lib/news";
import { CreatorSchema, ArticleSchema, SiteSettingsSchema } from "@/lib/validation";
import { z } from "zod";

const SESSIONCookieName = "admin_session_pta";

export async function loginWithPin(pin: string) {
  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(',')[0] || "unknown";
  const rateLimitKey = `login_attempts:${ip}`;

  // Simple Rate Limiting
  try {
    const attempts = await redis.incr(rateLimitKey);
    if (attempts === 1) {
      await redis.expire(rateLimitKey, 60 * 15); // 15 minute window
    }
    if (attempts > 10) {
      return { error: "Too many attempts. Locked for 15 minutes." };
    }
  } catch (e) {
    // Fail-safe if Redis is down in dev
    console.error("Rate limit check failed", e);
  }

  const correctPin = process.env.ADMIN_PIN;
  
  console.log(`[AUTH] Login attempt received.`);
  
  if (!correctPin || pin !== correctPin) {
    console.error("[AUTH] PIN mismatch");
    return { error: "Invalid PIN" };
  }

  // Clear rate limit on success
  try { await redis.del(rateLimitKey); } catch(e) {}

  const sessionId = crypto.randomUUID();
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  // ONLY attempt Redis if we have credentials OR we are in production
  if (process.env.NODE_ENV === "production" || (redisUrl && redisToken)) {
    try {
      await redis.setex(`admin_session:${sessionId}`, 60 * 60 * 24, "valid");
    } catch (error: any) {
      if (process.env.NODE_ENV === "production") {
        console.error('CRITICAL REDIS ERROR:', error.message);
        return { error: `Database Connection Error: ${error.message}` };
      }
      // FALL THROUGH for development mock mode
    }
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSIONCookieName, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  });

  return { success: true };
}

export async function logout() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSIONCookieName)?.value;
  if (sessionId) {
    await redis.del(`admin_session:${sessionId}`);
  }
  cookieStore.delete(SESSIONCookieName);
  return { success: true };
}

export async function checkSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSIONCookieName)?.value;
  if (!sessionId) return false;

  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  // If we are missing Redis, we can't verify the session against a database.
  // In development, we'll allow the session to be valid if the cookie exists.
  if (!(redisUrl && redisToken)) {
      return false;
  }

  try {
    const isValid = await redis.get(`admin_session:${sessionId}`);
    return !!isValid;
  } catch (e) {
    return false;
  }
}

// Server actions for data manipulation
export async function getCreatorsAction() {
  const isAdmin = await checkSession();
  if (!isAdmin) throw new Error("Unauthorized");
  return await getCreatorsFromDb();
}

export async function saveCreatorsAction(creators: Creator[]) {
  const isAdmin = await checkSession();
  if (!isAdmin) throw new Error("Unauthorized");
  
  // Zod Validation
  try {
    z.array(CreatorSchema).parse(creators);
    await saveCreatorsToDb(creators);
    return { success: true };
  } catch (err: any) {
    return { error: "Validation failed: " + err.message };
  }
}

export async function getSiteSettingsAction() {
  const isAdmin = await checkSession();
  if (!isAdmin) throw new Error("Unauthorized");
  return await getSiteSettingsFromDb();
}

export async function saveSiteSettingsAction(settings: SiteSettings) {
  const isAdmin = await checkSession();
  if (!isAdmin) throw new Error("Unauthorized");
  
  try {
    SiteSettingsSchema.parse(settings);
    await saveSiteSettingsToDb(settings);
    return { success: true };
  } catch (err: any) {
    return { error: "Validation failed: " + err.message };
  }
}

export async function getNewsAction() {
  const isAdmin = await checkSession();
  if (!isAdmin) throw new Error("Unauthorized");
  return await getNewsFromDb();
}

export async function saveNewsAction(news: Article[]) {
  const isAdmin = await checkSession();
  if (!isAdmin) throw new Error("Unauthorized");
  
  try {
    z.array(ArticleSchema).parse(news);
    await saveNewsToDb(news);
    return { success: true };
  } catch (err: any) {
    return { error: "Validation failed: " + err.message };
  }
}
