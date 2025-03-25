import { Button } from "@mantine/core";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";

interface Props {
  children: React.ReactNode;
}
const ErrorFallback = ({ error }: FallbackProps) => {
  return (
    <div
      className="flex flex-col h-screen justify-center items-center"
      role="alert"
    >
      <h2 className="text-lg font-semibold">Terjadi Kesalahan</h2>
      <p className="text-red-500">{error.message}</p>
      <Button
        className="mt-4"
        onClick={() => window.location.assign(window.location.origin)}
      >
        Refresh
      </Button>
    </div>
  );
};

export const ErrorProvider: React.FC<Props> = ({ children }) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>{children}</ErrorBoundary>
  );
};
