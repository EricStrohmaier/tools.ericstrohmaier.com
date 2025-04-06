"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getURL, getErrorRedirect, getStatusRedirect } from "@/utils/helpers";
import { getAuthTypes } from "@/utils/auth-helpers/settings";

function isValidEmail(email: string) {
  var regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
}

export async function redirectToPath(path: string) {
  return redirect(path);
}

export const signIn = async () => {
  const supabase = createClient();
  await supabase.auth.signInAnonymously();
};

export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { data: null, error: error };
  }

  return { data: null, error: null };
}

export async function signInWithEmail(formData: FormData) {
  // const subdomain = hostname.split(".")[0]; // Extract the subdomain
  const cookieStore = cookies();
  
  // Check if the user is coming from the extension
  const isExtension = formData.get("extension") === "true";
  
  const callbackURL = getURL("/api/auth/confirm", "", isExtension);

  const email = String(formData.get("email")).trim();
  let redirectPath: string;

  if (!isValidEmail(email) || email === "") {
    return (redirectPath = getErrorRedirect(
      `/signin/email_signin`,
      "Invalid email address.",
      "Please try again."
    ));
  }

  const supabase = createClient();
  let options = {
    email,
    emailRedirectTo: callbackURL,
    shouldCreateUser: true,
  };

  // If allowPassword is false, do not create a new user
  const { allowPassword } = getAuthTypes();

  if (allowPassword) options.shouldCreateUser = false;

  const { data, error } = await supabase.auth.signInWithOtp({
    email: email,
    options: {
      emailRedirectTo: callbackURL,
      shouldCreateUser: true,
    },
  });

  if (error) {
    redirectPath = getErrorRedirect(
      `/signin/email_signin`,
      "You could not be signed in.",
      error.message
    );
  } else if (data) {
    cookieStore.set("preferredSignInView", "email_signin", { path: "/" });
    console.log(
      "Please check your email for a magic link. You may now close this tab."
    );

    redirectPath = getStatusRedirect(
      `/signin/email_signin`,
      "Success!",
      "Please check your email for a magic link. You may now close this tab.",
      true
    );
  } else {
    redirectPath = getErrorRedirect(
      `/signin/email_signin`,
      "Hmm... Something went wrong.",
      "You could not be signed in."
    );
  }

  return redirectPath;
}

export async function signInWithEmailCode(
  formData: FormData,
  hostname: string
) {
  // const subdomain = hostname.split(".")[0]; // Extract the subdomain
  const cookieStore = cookies();
  const callbackURL = getURL("/api/auth/confirm");

  const email = String(formData.get("email")).trim();
  let redirectPath: string;

  if (!isValidEmail(email) || email === "") {
    return (redirectPath = getErrorRedirect(
      `/signin/email_signin`,
      "Invalid email address.",
      "Please try again."
    ));
  }

  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOtp({
    email: email,
    options: {
      emailRedirectTo: callbackURL,
      shouldCreateUser: true,
    },
  });

  if (error) {
    redirectPath = getErrorRedirect(
      `/signin/email_signin`,
      "You could not be signed in.",
      error.message
    );
  } else if (data) {
    cookieStore.set("preferredSignInView", "email_signin", { path: "/" });
    console.log(
      "Please check your email for a magic link. You may now close this tab."
    );

    redirectPath = getStatusRedirect(
      `/signin/email_signin`,
      "Success!",
      "Please check your email for a magic link. You may now close this tab.",
      true
    );
  } else {
    redirectPath = getErrorRedirect(
      `/signin/email_signin`,
      "Hmm... Something went wrong.",
      "You could not be signed in."
    );
  }

  return redirectPath;
}

export async function requestPasswordUpdate(
  formData: FormData,
  hostname: string
) {
  const subdomain = hostname.split(".")[0]; // Extract the subdomain
  // TODO check if this is the correct path
  const callbackURL = getURL("/api/auth/reset_password", subdomain);

  // Get form data
  const email = String(formData.get("email")).trim();
  let redirectPath: string;

  if (!isValidEmail(email)) {
    redirectPath = getErrorRedirect(
      "/signin/forgot_password",
      "Invalid email address.",
      "Please try again."
    );
  }

  const supabase = createClient();

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: callbackURL,
  });

  if (error) {
    redirectPath = getErrorRedirect(
      "/signin/forgot_password",
      error.message,
      "Please try again."
    );
  } else if (data) {
    redirectPath = getStatusRedirect(
      "/signin/forgot_password",
      "Success!",
      "Please check your email for a password reset link. You may now close this tab.",
      true
    );
  } else {
    redirectPath = getErrorRedirect(
      "/signin/forgot_password",
      "Hmm... Something went wrong.",
      "Password reset email could not be sent."
    );
  }

  return redirectPath;
}

export async function signInWithPassword(formData: FormData) {
  const cookieStore = cookies();
  const email = String(formData.get("email")).trim();
  const password = String(formData.get("password")).trim();
  // Check if the user is coming from the extension
  const isExtension = formData.get("extension") === "true";
  let redirectPath: string;

  const supabase = createClient();
  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirectPath = getErrorRedirect(
      "/signin/password_signin",
      "Sign in failed.",
      error.message,
      false,
      "",
      isExtension
    );
  } else if (data.user) {
    cookieStore.set("preferredSignInView", "password_signin", { path: "/" });
    // If coming from extension, redirect to extension success page
    redirectPath = isExtension 
      ? getStatusRedirect("/extension-auth-success", "Success!", "You are now signed in.", false, "", true)
      : getStatusRedirect("/", "Success!", "You are now signed in.");
  } else {
    redirectPath = getErrorRedirect(
      "/signin/password_signin",
      "Hmm... Something went wrong.",
      "You could not be signed in.",
      false,
      "",
      isExtension
    );
  }

  return redirectPath;
}

export async function signUp(formData: FormData, hostname: string) {
  // const subdomain = hostname.split(".")[0]; // Extract the subdomain
  
  // Check if the user is coming from the extension
  const isExtension = formData.get("extension") === "true";

  const callbackURL = getURL("/api/auth/confirm", "", isExtension);

  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password")).trim();
  let redirectPath: string;

  if (email === "") {
    return (redirectPath = getErrorRedirect(
      "/signin/signup",
      "Email address is required.",
      "Please provide your email address."
    ));
  } else if (!isValidEmail(email)) {
    return (redirectPath = getErrorRedirect(
      "/signin/signup",
      "Invalid email address.",
      "Please try again."
    ));
  }

  const supabase = createClient();

  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: callbackURL,
    },
  });

  if (error) {
    redirectPath = getErrorRedirect(
      "/signin/signup",
      "Sign up failed.",
      error.message
    );
  } else if (data.session) {
    redirectPath = getStatusRedirect("/", "Success!", "You are now signed in.");
  } else if (
    data.user &&
    data.user.identities &&
    data.user.identities.length == 0
  ) {
    redirectPath = getErrorRedirect(
      "/signin/signup",
      "Sign up failed.",
      "There is already an account associated with this email address. Try resetting your password."
    );
  } else if (data.user) {
    redirectPath = getStatusRedirect(
      "/",
      "Success!",
      "Please check your email for a confirmation link. You may now close this tab."
    );
  } else {
    redirectPath = getErrorRedirect(
      "/signin/signup",
      "Hmm... Something went wrong.",
      "You could not be signed up."
    );
  }

  return redirectPath;
}

export async function updatePassword(formData: FormData) {
  const password = String(formData.get("password")).trim();
  const passwordConfirm = String(formData.get("passwordConfirm")).trim();
  let redirectPath: string;

  // Check that the password and confirmation match
  if (password !== passwordConfirm) {
    redirectPath = getErrorRedirect(
      "/signin/update_password",
      "Your password could not be updated.",
      "Passwords do not match."
    );
  }

  const supabase = createClient();
  const { error, data } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    redirectPath = getErrorRedirect(
      "/signin/update_password",
      "Your password could not be updated.",
      error.message
    );
  } else if (data.user) {
    redirectPath = getStatusRedirect(
      "/",
      "Success!",
      "Your password has been updated."
    );
  } else {
    redirectPath = getErrorRedirect(
      "/signin/update_password",
      "Hmm... Something went wrong.",
      "Your password could not be updated."
    );
  }

  return redirectPath;
}

export async function updateEmail(formData: FormData) {
  // Get form data
  const newEmail = String(formData.get("newEmail")).trim();

  // Check that the email is valid
  if (!isValidEmail(newEmail)) {
    return getErrorRedirect(
      "/account",
      "Your email could not be updated.",
      "Invalid email address."
    );
  }

  const supabase = createClient();
  // TODO check if this is the correct path
  const callbackUrl = getURL(
    getStatusRedirect("/account", "Success!", `Your email has been updated.`)
  );

  const { error } = await supabase.auth.updateUser(
    { email: newEmail },
    {
      emailRedirectTo: callbackUrl,
    }
  );

  if (error) {
    return getErrorRedirect(
      "/account",
      "Your email could not be updated.",
      error.message
    );
  } else {
    return getStatusRedirect(
      "/account",
      "Confirmation emails sent.",
      `You will need to confirm the update by clicking the links sent to both the old and new email addresses.`
    );
  }
}

export async function updateName(formData: FormData) {
  // Get form data
  const fullName = String(formData.get("fullName")).trim();

  const supabase = createClient();
  const { error, data } = await supabase.auth.updateUser({
    data: { full_name: fullName },
  });

  if (error) {
    return getErrorRedirect(
      "/account",
      "Your name could not be updated.",
      error.message
    );
  } else if (data.user) {
    return getStatusRedirect(
      "/account",
      "Success!",
      "Your name has been updated."
    );
  } else {
    return getErrorRedirect(
      "/account",
      "Hmm... Something went wrong.",
      "Your name could not be updated."
    );
  }
}

export async function requestResetPassword(formData: FormData) {
  const options = {
    redirectTo: getURL(),
  };
  // Get form data
  const email = String(formData.get("email")).trim();
  let redirectPath: string;

  if (!isValidEmail(email)) {
    redirectPath = getErrorRedirect(
      "/forgot_password",
      "Invalid email address.",
      "Please try again."
    );
  }

  const supabase = createClient();

  const { data, error } = await supabase.auth.resetPasswordForEmail(
    email,
    options
  );

  if (error) {
    redirectPath = getErrorRedirect(
      "/forgot_password",
      error.message,
      "Please try again."
    );
  } else if (data) {
    redirectPath = getStatusRedirect(
      "/forgot_password",
      "Success!",
      "Please check your email for a password reset link. You may now close this tab.",
      true
    );
  } else {
    redirectPath = getErrorRedirect(
      "/forgot_password",
      "Hmm... Something went wrong.",
      "Password reset email could not be sent."
    );
  }

  return redirectPath;
}
