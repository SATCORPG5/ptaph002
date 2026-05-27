"use server";
// Deprecated: Creator auth now uses TikTok OAuth.
// These stubs prevent import errors from any remaining references.

export async function creatorLogin(_args: { email: string; password: string }) {
  return { error: "This login method is deprecated. Please use TikTok sign-in." };
}

export async function creatorSignup(_args: { email: string; password: string; inviteCode: string }) {
  return { error: "This signup method is deprecated. Please use TikTok sign-in." };
}
