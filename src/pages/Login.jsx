import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import loginImage from "../assets/image/login.svg";
import { useDispatch, useSelector } from "react-redux";
import { loginWithGoogle, signInUserWithEmailPassword, createUser, clearUserError } from "../redux/features/user/userSlice";
import { useEffect } from "react";
import toast from "react-hot-toast";

const Login = () => {
  const { register, handleSubmit, setValue } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isError, error } = useSelector((state) => state.userSlice);

  useEffect(() => {
    dispatch(clearUserError());
  }, [dispatch]);

  useEffect(() => {
    if (isError && error) {
      toast.error(error);
      dispatch(clearUserError());
    }
  }, [isError, error, dispatch]);

  const onSubmit = ({ email, password }) => {
    dispatch(signInUserWithEmailPassword({ email, password }));
  };

  const handleGoogleLogin = () => {
    dispatch(loginWithGoogle());
  };

  const handleDemoLogin = async () => {
    setValue("email", "muntasir@gmail.com");
    setValue("password", "muntasir@gmail.com");
    
    try {
      const result = await dispatch(
        signInUserWithEmailPassword({ email: "muntasir@gmail.com", password: "muntasir@gmail.com" })
      ).unwrap();
      if (result) {
        toast.success("Logged in as Muntasir!");
      }
    } catch (err) {
      try {
        await dispatch(
          createUser({ email: "muntasir@gmail.com", password: "muntasir@gmail.com", name: "Muntasir" })
        ).unwrap();
        toast.success("Demo user created and logged in!");
      } catch (signupErr) {
        toast.error(signupErr?.message || "Demo login failed");
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex items-center justify-center p-4 sm:p-8 transition-colors">
      <div className="flex flex-col lg:flex-row max-w-5xl w-full items-center justify-center gap-8 lg:gap-16 my-auto">
        <div className="w-full lg:w-1/2 max-w-md">
          <img src={loginImage} className="w-full h-auto max-h-[350px] object-contain mx-auto" alt="Login Illustration" />
        </div>
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 w-full max-w-md rounded-2xl shadow-lg p-6 sm:p-10 transition-colors">
            <h1 className="mb-6 font-semibold text-2xl sm:text-3xl text-center">Login</h1>
            <form className="space-y-4 w-full" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col items-start gap-1">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent dark:bg-slate-700/50 dark:text-white focus:outline-none focus:border-primary transition-all text-sm"
                  {...register("email", { required: true })}
                />
              </div>
              <div className="flex flex-col items-start gap-1">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent dark:bg-slate-700/50 dark:text-white focus:outline-none focus:border-primary transition-all text-sm"
                  {...register("password", { required: true })}
                />
              </div>
              <div className="pt-2 flex flex-col gap-3">
                <button type="submit" className="btn btn-primary w-full py-2.5 text-base">
                  Login
                </button>
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="btn w-full py-2.5 text-base bg-emerald-600 hover:bg-emerald-700 text-white transition-all border-none rounded-xl font-medium"
                >
                  Demo Login
                </button>
              </div>
              <div className="text-center text-sm">
                <p className="text-slate-600 dark:text-slate-400">
                  Don&apos;t have an account?{" "}
                  <span
                    className="text-primary dark:text-blue-400 font-semibold hover:underline cursor-pointer"
                    onClick={() => navigate("/signup")}
                  >
                    Sign up
                  </span>
                </p>
              </div>
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                <span className="flex-shrink mx-4 text-xs text-slate-400">OR</span>
                <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
              </div>
              <button
                type="button"
                className="btn btn-primary w-full py-2.5 bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 border-none text-white transition-all"
                onClick={handleGoogleLogin}
              >
                Login with Google
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
