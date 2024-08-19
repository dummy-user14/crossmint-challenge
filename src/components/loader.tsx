const Spinner = () => (
  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
);

interface CrossmintLoaderProps {
  focus: string;
  message: string;
}

export const Loader = ({ focus, message }: CrossmintLoaderProps ) => (
  <div className="fixed inset-0 bg-black bg-opacity-20 flex justify-center items-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center">
      <Spinner />
      <p className="mt-4 text-gray-700 font-semibold uppercase">{focus}...</p>
      <p className="mt-2 text-gray-500 text-sm">{message}</p>
    </div>
  </div>
);
