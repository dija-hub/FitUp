if (isSignUp) {
  const { data, error: signUpError } =
    await supabase.auth.signUp({
      email: email.trim(),
      password: password,
      options: {
        emailRedirectTo: "https://fit-up-rouge.vercel.app",
        data: {
          full_name: fullName.trim(),
        },
      },
    });

  console.log("Signup data:", data);
  console.log("Signup error:", signUpError);

  // If signup failed, stop here
  if (signUpError) {
    setError(signUpError.message);
    return;
  }

  // Show success message
  setSuccessMessage("Account created successfully!");

  // Wait 1.2 seconds, then open Dashboard
  setTimeout(() => {
    setIsLoggedIn(true);
    setShowDashboard(true);
    setShowSignUp(false);
  }, 1200);
}