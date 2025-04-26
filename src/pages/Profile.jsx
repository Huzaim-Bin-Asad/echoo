import React from 'react';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileImage from '../components/profile/ProfileImage';
import ProfileInfoItem from '../components/profile/ProfileInfoItem';
import { UserRound, AtSign, Signature, Dna } from 'lucide-react'; // Icons
import { useUser } from '../services/UserContext.jsx'; // 🆕 Import UserContext hook

const Profile = () => {
  const { user, loading } = useUser(); // 🆕 Access user and loading from context

  if (loading) {
    return (
      <div className="container py-4" style={{ backgroundColor: '#121B22', minHeight: '100vh' }} />
    );
  }

  if (!user || !user.user) {
    return (
      <div className="container py-4" style={{ backgroundColor: '#121B22', minHeight: '100vh' }}>
        <p className="text-white">No user data found.</p>
      </div>
    );
  }

  const { first_name, last_name, about_message, email, username } = user.user; // 🆕 destructure

  return (
    <div className="container py-4" style={{ backgroundColor: '#121B22', minHeight: '100vh' }}>
      <ProfileHeader />
      <ProfileImage />

      {/* Name with UserRound Icon */}
      <ProfileInfoItem
        icon={<UserRound size={26} className="text-white me-2" style={{ verticalAlign: 'middle' }} />}
        label="Name"
        value={`${first_name} ${last_name}`}
      />

      {/* About with Dna Icon */}
      <ProfileInfoItem
        icon={<Dna size={26} className="text-white me-2" style={{ verticalAlign: 'middle' }} />}
        label="About"
        value={about_message || "No about message yet."}
      />

      {/* Email with AtSign Icon */}
      <ProfileInfoItem
        icon={<AtSign size={26} className="text-white me-2" style={{ verticalAlign: 'middle' }} />}
        label="Email"
        value={email}
      />

      {/* Username with Signature Icon */}
      <ProfileInfoItem
        icon={<Signature size={26} className="text-white me-2" style={{ verticalAlign: 'middle' }} />}
        label="Username"
        value={username}
      />
    </div>
  );
};

export default Profile;
