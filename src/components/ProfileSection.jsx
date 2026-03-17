import React from 'react';

const ProfileSection = ({ profile, loadingProfile }) => {
  const defaultProfileImg = "/assets/ProfilePhoto.png";

  return (
    <div className="w-full md:w-2/5">
      <div className="mb-4">
        <img 
          src={profile?.profile_image && !profile.profile_image.endsWith("null") ? profile.profile_image : defaultProfileImg} 
          alt="Profile" 
          className="w-20 h-20 rounded-full border border-gray-200 object-cover"
          onError={(e) => { e.target.src = defaultProfileImg }}
        />
      </div>
      <p className="text-xl text-gray-600 mb-1">Selamat datang,</p>
      {loadingProfile ? (
        <div className="h-10 w-48 bg-gray-200 animate-pulse rounded"></div>
      ) : (
        <h1 className="text-4xl font-bold tracking-tight text-[#333333]">
          {profile?.first_name} {profile?.last_name}
        </h1>
      )}
    </div>
  );
};

export default ProfileSection;
