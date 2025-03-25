'use client';

export default function LoginForm() {
  return (
    <div className="max-w-md w-full mx-auto space-y-8">
      <h2 className="text-center text-3xl">Voice to EHR</h2>
      <p className="text-center">MVP version 1.0.0</p>
      
      <form className="space-y-6">
        <div>
          <label>Doctor's entry-code</label>
          <input type="text" className="w-full" />
        </div>
        
        <div>
          <label>Doctor's password</label>
          <input type="password" className="w-full" />
        </div>

        <button type="submit" className="w-full">
          Login
        </button>
      </form>
    </div>
  );
} 