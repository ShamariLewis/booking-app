import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";

export type SignInFormData = {
  email: string;
  password: string;
};

const SignIn = () => {
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const queryClient = useQueryClient();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<SignInFormData>();

  const mutation = useMutation(apiClient.signIn, {
    onSuccess: async () => {
      showToast({ message: "Sign in Successful!", type: "SUCCESS" });
      await queryClient.invalidateQueries("validateToken");
      navigate("/");
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <h2 className="text-3xl font-bold">Sign In</h2>
      <label htmlFor="" className="text-gray-700 tex-sm font-bold flex-1">
        Email
        <input
          type="email"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("email", { required: "Please provide a username" })}
        />
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}
      </label>
      <label htmlFor="" className="text-gray-700 tex-sm font-bold flex-1">
        Password
        <input
          type="password"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("password", {
            required: "Please provide your password",
          })}
        />
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}
      </label>
      <span className="flex justify-between items-center">
        <span className="text-sm">
          Not Registered?{" "}
          <Link to="/register" className="text-blue-600 underline">
            Create Account
          </Link>
        </span>
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl"
        >
          Login
        </button>
      </span>
    </form>
  );
};
export default SignIn;
