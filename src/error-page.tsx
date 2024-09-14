import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div
      id="error-page"
      className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900"
    >
      <h1 className="text-4xl font-bold mb-4s">Oops!</h1>
      <p className="text-lg mb-2">Sorry, an unexpected error has occurred.</p>
      <p className="text-sm text-gray-600">
        <i>
          {(error as { statusText?: string; message?: string }).statusText ||
            (error as { message?: string }).message}
        </i>
      </p>
    </div>
  );
}
