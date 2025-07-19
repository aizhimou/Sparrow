import React from "react";

const PasswordResetForm = () => {
  return (
    <div>
      <h2>Password Reset</h2>
      <p>Please enter your email to reset your password.</p>
      <form>
        <input type="email" placeholder="Email" required />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
}

export default PasswordResetForm;