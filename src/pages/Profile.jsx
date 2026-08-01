import { useState, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile } from "firebase/auth";
import auth from "../utils/firebase.config";
import { updateUserPhoto } from "../redux/features/user/userSlice";
import toast from "react-hot-toast";

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80";

const formatPhotoURL = (url) => {
  if (!url) return "";
  let cleanUrl = url.trim();

  // Convert Google Drive view link to direct CDN image link
  const driveMatch = cleanUrl.match(/drive\.google\.com\/file\/d\/([^\/]+)/);
  if (driveMatch && driveMatch[1]) {
    return `https://lh3.googleusercontent.com/u/0/d/${driveMatch[1]}`;
  }

  const driveUcMatch = cleanUrl.match(/drive\.google\.com\/uc\?.*id=([^&]+)/);
  if (driveUcMatch && driveUcMatch[1]) {
    return `https://lh3.googleusercontent.com/u/0/d/${driveUcMatch[1]}`;
  }

  // Convert tmpfiles.org page link to direct download link
  if (cleanUrl.includes("tmpfiles.org/") && !cleanUrl.includes("tmpfiles.org/dl/")) {
    cleanUrl = cleanUrl.replace("tmpfiles.org/", "tmpfiles.org/dl/");
  }

  // Convert Dropbox view link to raw image stream
  if (cleanUrl.includes("dropbox.com") && cleanUrl.includes("dl=0")) {
    cleanUrl = cleanUrl.replace("dl=0", "raw=1");
  }

  return cleanUrl;
};

const Profile = () => {
  const dispatch = useDispatch();
  const { name, email, photoURL, providerId } = useSelector(
    (state) => state.userSlice
  );

  const [imageUrlInput, setImageUrlInput] = useState("");
  const [updating, setUpdating] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  const isGoogleUser = providerId === "google.com";
  const displayPhoto = useMemo(() => formatPhotoURL(photoURL), [photoURL]);

  const handleUrlChange = useCallback((e) => {
    setImageUrlInput(e.target.value);
    setPreviewError(false);
  }, []);

  const handleUpdatePhoto = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) return toast.error("No active user session found!");

    let urlToSave = imageUrlInput.trim();
    if (!urlToSave) return toast.error("Please enter a valid image URL!");

    urlToSave = formatPhotoURL(urlToSave);

    if (urlToSave.length > 2000) {
      return toast.error("Photo URL is too long (must be under 2000 characters).");
    }

    try {
      setUpdating(true);

      // 1. Update Firebase Auth Profile with direct photo URL
      await updateProfile(user, { photoURL: urlToSave });

      // 2. Reload user object in Firebase Auth
      try {
        await user.reload();
      } catch (reloadErr) {
        console.warn("User reload skipped:", reloadErr);
      }

      // 3. Update Redux store
      dispatch(updateUserPhoto(urlToSave));

      toast.success("Profile picture updated successfully!");
      setImageUrlInput("");
      setPreviewError(false);
    } catch (err) {
      console.error("Profile update error:", err);
      toast.error(err.message || "Failed to update profile picture!");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-slate-100">
        User Profile
      </h1>

      {/* User Info & Avatar Preview */}
      <div className="bg-secondary/10 dark:bg-slate-800 p-6 rounded-2xl flex items-center gap-6 mb-8 border border-secondary/20 dark:border-slate-700">
        <img
          src={displayPhoto || DEFAULT_AVATAR}
          alt="Profile Avatar"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = DEFAULT_AVATAR;
          }}
          className="w-24 h-24 rounded-full object-cover border-4 border-primary shadow-md"
        />
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {name || "User"}
          </h2>
          <p className="text-gray-600 dark:text-slate-300 text-sm">{email}</p>
          <div className="pt-2">
            <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-primary/20 text-primary dark:bg-primary/30 dark:text-blue-300">
              Provider: {isGoogleUser ? "Google Account" : "Email & Password"}
            </span>
          </div>
        </div>
      </div>

      {/* Profile Photo Form */}
      {isGoogleUser ? (
        <div className="p-4 bg-blue-50 dark:bg-slate-800/80 border border-blue-200 dark:border-slate-700 rounded-xl text-sm text-blue-700 dark:text-blue-300">
          ✨ Your profile picture is automatically synchronized from your Google account.
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800/60 p-6 rounded-2xl border border-secondary/20 dark:border-slate-700 space-y-4">
          <h3 className="font-semibold text-lg text-gray-800 dark:text-slate-200">
            Update Profile Picture URL
          </h3>
          <p className="text-xs text-gray-500 dark:text-slate-400">
            Paste a direct HTTPS image URL below (e.g. from Unsplash, ImgBB, GitHub, etc.).
          </p>

          <form onSubmit={handleUpdatePhoto} className="space-y-4">
            <div>
              <input
                type="url"
                placeholder="https://images.unsplash.com/photo-1534528741775-53994a69daeb"
                value={imageUrlInput}
                onChange={handleUrlChange}
                className="w-full px-4 py-2.5 rounded-xl border border-secondary/20 dark:border-slate-700 bg-transparent text-sm dark:text-white focus:outline-none focus:border-primary transition-all"
              />
            </div>

            {/* Live Preview Box */}
            {imageUrlInput.trim() && (
              <div className="p-3 border border-secondary/20 dark:border-slate-700 rounded-xl flex items-center gap-4 bg-slate-50 dark:bg-slate-900/50">
                <img
                  src={formatPhotoURL(imageUrlInput.trim())}
                  alt="Live Preview"
                  onLoad={() => setPreviewError(false)}
                  onError={() => setPreviewError(true)}
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary"
                />
                <div className="text-xs">
                  {previewError ? (
                    <span className="text-red-500 font-medium">
                      ❌ Invalid or broken image link. Please try another URL.
                    </span>
                  ) : (
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                      ✅ Live Preview: Image loaded successfully!
                    </span>
                  )}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={updating || !imageUrlInput.trim() || previewError}
              className="btn btn-primary w-fit disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updating ? "Saving..." : "Save Photo URL"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;
