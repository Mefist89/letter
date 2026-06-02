import React, { useState, useEffect } from "react";

// Define the required files for the application
const REQUIRED_FILES = [
  { id: "sean-audio", name: "sean.mp3", type: "audio", path: "/sean.mp3" },
  {
    id: "background-img",
    name: "background.jpg",
    type: "image",
    path: "/background.jpg",
  },
  {
    id: "letter-content",
    name: "letter.json",
    type: "data",
    path: "/letter.json",
  },
];

const LoadingPage = () => {
  const [verificationStatus, setVerificationStatus] = useState<
    Record<string, boolean>
  >({});
  const [loading, setLoading] = useState(true);
  const [allFilesVerified, setAllFilesVerified] = useState(false);
  const [errorFiles, setErrorFiles] = useState<string[]>([]);

  // Simulate file verification process
  useEffect(() => {
    const verifyFiles = async () => {
      const status: Record<string, boolean> = {};
      const errors: string[] = [];

      for (const file of REQUIRED_FILES) {
        try {
          // Simulate API call or file check
          await new Promise((resolve) => setTimeout(resolve, 500));

          // Simulate 80% success rate for demonstration
          const isSuccess = Math.random() > 0.2;
          status[file.id] = isSuccess;

          if (!isSuccess) {
            errors.push(file.name);
          }
        } catch (error) {
          status[file.id] = false;
          errors.push(file.name);
        }
      }

      setVerificationStatus(status);
      setErrorFiles(errors);
      setAllFilesVerified(Object.values(status).every((verified) => verified));
      setLoading(false);
    };

    verifyFiles();
  }, []);

  const handleStart = () => {
    // Navigate to the main application page using hash routing
    window.location.hash = "#/app";
  };

  const retryVerification = () => {
    setLoading(true);
    setVerificationStatus({});
    setAllFilesVerified(false);
    setErrorFiles([]);

    // Restart the verification process
    setTimeout(() => {
      const verifyFiles = async () => {
        const status: Record<string, boolean> = {};
        const errors: string[] = [];

        for (const file of REQUIRED_FILES) {
          try {
            await new Promise((resolve) => setTimeout(resolve, 500));

            // Simulate 80% success rate for demonstration
            const isSuccess = Math.random() > 0.2;
            status[file.id] = isSuccess;

            if (!isSuccess) {
              errors.push(file.name);
            }
          } catch (error) {
            status[file.id] = false;
            errors.push(file.name);
          }
        }

        setVerificationStatus(status);
        setErrorFiles(errors);
        setAllFilesVerified(
          Object.values(status).every((verified) => verified),
        );
        setLoading(false);
      };

      verifyFiles();
    }, 100);
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-indigo-950 flex flex-col items-center justify-between overflow-hidden">
      {/* Background elements similar to the main app */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Aurora effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="aurora aurora-1"></div>
        <div className="aurora aurora-2"></div>
        <div className="aurora aurora-3"></div>
      </div>

      {/* Header section */}
      <header className="w-full py-6 px-4 sm:px-6 text-center z-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-blue-100 font-serif tracking-wide">
          Night Letter Experience
        </h1>
        <p className="text-blue-200 mt-2 text-sm sm:text-base">
          Preparing your personalized experience
        </p>
      </header>

      {/* Main content area */}
      <main className="flex-1 w-full max-w-md flex flex-col items-center justify-center px-4 z-10">
        <div className="w-full bg-blue-900/20 backdrop-blur-sm rounded-xl shadow-2xl shadow-blue-500/20 p-6 border border-blue-700/30">
          <h2 className="text-xl sm:text-2xl font-semibold text-blue-100 mb-6 text-center">
            File Verification
          </h2>

          <div className="space-y-4">
            {REQUIRED_FILES.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-blue-800/20 rounded-lg border border-blue-700/30"
              >
                <div className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full mr-3 ${
                      loading
                        ? "bg-yellow-500 animate-pulse"
                        : verificationStatus[file.id]
                          ? "bg-green-500"
                          : "bg-red-500"
                    }`}
                  ></div>
                  <span className="text-blue-100 font-medium">{file.name}</span>
                </div>

                <div>
                  {loading ? (
                    <div className="w-6 h-6 border-t-2 border-blue-300 border-solid rounded-full animate-spin"></div>
                  ) : verificationStatus[file.id] ? (
                    <div className="w-6 h-6 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    </div>
                  ) : (
                    <div className="w-6 h-6 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-red-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        ></path>
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {loading ? (
            <div className="mt-6">
              <div className="w-full bg-blue-800/30 rounded-full h-2.5">
                <div
                  className="bg-blue-400 h-2.5 rounded-full animate-pulse"
                  style={{ width: "60%" }}
                ></div>
              </div>
              <p className="text-blue-200 text-center mt-2 text-sm">
                Verifying files...
              </p>
            </div>
          ) : allFilesVerified ? (
            <div className="mt-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 p-2 mb-3">
                <svg
                  className="w-8 h-8 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <p className="text-green-400 font-medium">
                All files verified successfully!
              </p>
            </div>
          ) : (
            <div className="mt-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20 p-2 mb-3">
                <svg
                  className="w-8 h-8 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <p className="text-red-400 font-medium mb-2">
                {errorFiles.length} file{errorFiles.length !== 1 ? "s" : ""}{" "}
                missing or incomplete
              </p>
              <p className="text-blue-200 text-sm mb-4">
                {errorFiles.join(", ")}
              </p>
              <button
                onClick={retryVerification}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300 text-sm"
              >
                Retry Verification
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Start button at the bottom */}
      <footer className="w-full py-6 px-4 flex justify-center z-10">
        <button
          onClick={handleStart}
          disabled={!allFilesVerified || loading}
          className={`px-8 py-4 rounded-full text-lg font-bold transition-all duration-300 transform hover:scale-105 ${
            allFilesVerified && !loading
              ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70"
              : "bg-gray-600 text-gray-400 cursor-not-allowed"
          }`}
        >
          Start Experience
        </button>
      </footer>

      {/* Custom styles for aurora effect */}
      <style jsx>{`
        .aurora {
          position: absolute;
          width: 100%;
          height: 200px;
          filter: blur(40px);
          opacity: 0.3;
        }

        .aurora-1 {
          top: 0;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(34, 211, 238, 0.4),
            rgba(59, 130, 246, 0.4),
            transparent
          );
          animation: aurora-wave 15s ease-in-out infinite;
        }

        .aurora-2 {
          top: 50px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(147, 51, 234, 0.3),
            rgba(59, 130, 246, 0.3),
            transparent
          );
          animation: aurora-wave 20s ease-in-out infinite 5s;
        }

        .aurora-3 {
          top: 100px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(59, 130, 246, 0.3),
            rgba(34, 211, 238, 0.3),
            transparent
          );
          animation: aurora-wave 18s ease-in-out infinite 10s;
        }

        @keyframes aurora-wave {
          0%,
          100% {
            transform: translateX(-50%) scaleY(1);
            opacity: 0.3;
          }
          50% {
            transform: translateX(50%) scaleY(1.5);
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingPage;
